import {supabase} from "@configs"
import {Book, BookCreate, bookModel, BookUpdate} from "@models/Book"

const debug = require("debug")("Server:BookService");

export class BookService {
    static bookTableName = "books";
    static bucketName = "books";
    
    static translateBookCoverPathToUrl(cover_img_path: string): string {
        return supabase
            .storage
            .from(BookService.bucketName)
            .getPublicUrl(cover_img_path)
            .data
            .publicUrl;
    }
    
    static async addCoverToStorage(
        book_id: Book["book_id"], 
        file: Buffer<ArrayBufferLike>, 
        mimeType: string
    ){
        const fileExt = mimeType.split("/")[1];
        const fileName = `${book_id}.${fileExt}`;
    
        const res = await supabase
            .storage
            .from(BookService.bucketName)
            .upload(fileName, file, {
                contentType: mimeType,
                upsert: true
            });
    
        await supabase
            .from(BookService.bookTableName)
            .update({cover_img: fileName})
            .eq("book_id", book_id);
    
        if (res.error)
            throw new Error(`Error uploading book cover image: ${res.error.message}`);
    
        return BookService.translateBookCoverPathToUrl(fileName);
    }

    static async fetchBookById(book_id: Book["book_id"]){
        const {data, error} = await supabase
            .from(BookService.bookTableName)
            .select("*")
            .eq("book_id", book_id)
            .single();

        if (error)
            throw new Error(`Error fetching book with ID ${book_id}: ${error.message}`);

        const parsed = bookModel.parse(data);

        if(parsed.cover_img)
            parsed.cover_img = BookService.translateBookCoverPathToUrl(parsed.cover_img);

        return parsed;
    }
    
    static async addBook(
        book: BookCreate,
        file?: {
            file: Buffer<ArrayBufferLike>,
            mimeType: string
        }){
        const {data, error} = await supabase
            .from(BookService.bookTableName)
            .insert({...book}) 
            .select()
            .single();
        
        if (error)
            throw new Error(`Error adding new book: ${error.message}`);
    
        const parsed = bookModel.parse(data);
    
        if(file)
            parsed.cover_img = await BookService.addCoverToStorage(data.book_id, file.file, file.mimeType);
    
        return parsed;
    }
    
    static async deleteBookById(book_id: Book["book_id"]){
        // find the id first
        const bookref = await supabase
            .from(BookService.bookTableName)
            .select("*")
            .eq("book_id", book_id)
            .single()
    
        if (bookref.error)
            throw new Error(`Error fetching book with ID ${book_id} for deletion: ${bookref.error.message}`);
    
        const parsed = bookModel.parse(bookref.data)
    
        const {error} = await supabase
            .from(BookService.bookTableName)
            .delete()
            .eq("book_id", parsed.book_id);
    
        if (error)
            throw new Error(`Error deleting book with ID ${book_id}: ${error.message}`);
    
        if(parsed.cover_img){
            const res = await supabase
                .storage
                .from(BookService.bucketName)
                .remove([parsed.cover_img]);
    
            if(res.error)
                throw new Error(`Error deleting book cover image: ${res.error.message}`);
        }
    
        return true;
    }
    
    static async editBookById(
        book_id: Book["book_id"],
        updatedBook: BookUpdate,
        file? : {
            file: Buffer<ArrayBufferLike>,
            mimeType: string
        }
    ){
        debug(`Editing book with ID: ${book_id} with updates: ${JSON.stringify(updatedBook)}`);

        // check if book exists
        const book = await BookService.fetchBookById(book_id);

        // if updatedBook is empty, skip updating book table
        if(Object.keys(updatedBook).length !== 0){
            const {error} = await supabase
                .from(BookService.bookTableName)
                .update(updatedBook)
                .eq("book_id", book_id)
                .select()
                .single();
        
            if (error)
                throw new Error(`Error editing book with ID ${book_id}: ${error.message}`);
        }
    
        if(file){
            const fileExt = file.mimeType.split("/")[1];
            const fileName = `${book_id}.${fileExt}`;
    
            const res = await supabase
                .storage
                .from(BookService.bucketName)
                .upload(fileName, file.file, {
                    contentType: file.mimeType,
                    upsert: true
                });
    
            await supabase
                .from(BookService.bookTableName)
                .update({cover_img: fileName})
                .eq("book_id", book_id);
    
            if (res.error)
                throw new Error(`Error uploading book cover image: ${res.error.message}`);
    
            book.cover_img = BookService.translateBookCoverPathToUrl(fileName);
        }
        else if(book.cover_img){
            book.cover_img = BookService.translateBookCoverPathToUrl(book.cover_img);
        }
    
        return book;
    }
}