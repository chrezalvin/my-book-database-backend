import {supabase} from "@configs"
import { getPagination } from "@library";
import {Book, isBook} from "@models/Book"
import {User} from "@models/User";

const tableName = "books";
const bucketName = "books";

function translateBookCoverPathToUrl(cover_img_path: string): string {
    return supabase
        .storage
        .from(bucketName)
        .getPublicUrl(cover_img_path)
        .data
        .publicUrl;
}

export const fetchBooksByPage = async (page: number, pageSize: number) => {
    const {from, to} = getPagination(page, pageSize);

    const {data, error} = await supabase
        .from(tableName)
        .select("*")
        .range(from, to - 1) // Supabase range is inclusive, so we use to - 1
        .order("created_at", {ascending: false});

    if (error)
        throw new Error(`Error fetching books for page ${page}: ${error.message}`);

    for (const item of data){
        if(!isBook(item))
            throw new Error(`Fetched data is not a valid Book object: ${JSON.stringify(item)}`);

        if(item.cover_img)
            item.cover_img = translateBookCoverPathToUrl(item.cover_img);   
    }

    return data;
}

export const fetchBookById = async (book_id: Book["book_id"]) => {
    const {data, error} = await supabase
        .from(tableName)
        .select("*")
        .eq("book_id", book_id)
        .single();

    if (error)
        throw new Error(`Error fetching book with ID ${book_id}: ${error.message}`);

    if(!isBook(data))
        throw new Error(`Fetched data is not a valid Book object for ID ${book_id}`);

    if(data.cover_img)
        data.cover_img = translateBookCoverPathToUrl(data.cover_img);

    return data;
}

export const addBook = async (book: Omit<Book, "book_id" | "created_at" | "cover_img">, user_id: User["user_id"], file?: {
    file: Buffer<ArrayBufferLike>,
    mimeType: string
}) => {
    const {data, error} = await supabase
        .from(tableName)
        .insert({user_id, ...book}) 
        .select()
        .single();
    
    if (error)
        throw new Error(`Error adding new book: ${error.message}`);

    if(!isBook(data))
        throw new Error(`Inserted data is not a valid Book object`);

    if(file){
        const fileExt = file.mimeType.split("/")[1];
        const fileName = `${data.book_id}.${fileExt}`;

        const res = await supabase
            .storage
            .from(bucketName)
            .upload(fileName, file.file, {
                contentType: file.mimeType,
                upsert: true
            });

        await supabase
            .from(tableName)
            .update({cover_img: fileName})
            .eq("book_id", data.book_id);

        if (res.error)
            throw new Error(`Error uploading book cover image: ${res.error.message}`);

        data.cover_img = translateBookCoverPathToUrl(fileName);
    }

    return data;
}

export const deleteBookById = async (book_id: Book["book_id"]) => {
    // find the id first
    const bookref = await supabase
        .from(tableName)
        .select("*")
        .eq("book_id", book_id)
        .single()

    if (bookref.error)
        throw new Error(`Error fetching book with ID ${book_id} for deletion: ${bookref.error.message}`);

    if(!isBook(bookref.data))
        throw new Error(`Fetched data is not a valid Book object for ID ${book_id} during deletion`);

    const {data, error} = await supabase
        .from(tableName)
        .delete()
        .eq("book_id", book_id);

    if (error)
        throw new Error(`Error deleting book with ID ${book_id}: ${error.message}`);

    if(bookref.data.cover_img){
        const res = await supabase
            .storage
            .from(bucketName)
            .remove([bookref.data.cover_img]);

        if(res.error)
            throw new Error(`Error deleting book cover image: ${res.error.message}`);
    }

    return true;
}

export const editBookById = async (book_id: Book["book_id"], book: Partial<Omit<Book, "book_id" | "created_at" | "cover_img">>, file? : {
    file: Buffer<ArrayBufferLike>,
    mimeType: string
}) => {
    // measures if book is contaminated with user_id
    if("user_id" in book){
        throw new Error("Book update data should not contain user_id");
    }
    
    const {data, error} = await supabase
        .from(tableName)
        .update(book)
        .eq("book_id", book_id)
        .select()
        .single();

    if (error)
        throw new Error(`Error editing book with ID ${book_id}: ${error.message}`);

    if(!isBook(data))
        throw new Error(`Updated data is not a valid Book object for ID ${book_id}`);

    if(file){
        const fileExt = file.mimeType.split("/")[1];
        const fileName = `${book_id}.${fileExt}`;

        const res = await supabase
            .storage
            .from(bucketName)
            .upload(fileName, file.file, {
                contentType: file.mimeType,
                upsert: true
            });

        await supabase
            .from(tableName)
            .update({cover_img: fileName})
            .eq("book_id", book_id);

        if (res.error)
            throw new Error(`Error uploading book cover image: ${res.error.message}`);

        data.cover_img = translateBookCoverPathToUrl(fileName);
    }
    else if(data.cover_img){
        data.cover_img = translateBookCoverPathToUrl(data.cover_img);
    }

    return data;
}