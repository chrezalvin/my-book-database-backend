import { User } from "@models/User";
import { BookView } from "@models/Views/BookView";
import { BookGenreService } from "@services/individual_services/BookGenreService";
import { BookService } from "@services/individual_services/BookService";
import { BookViewService } from "@services/view_services/BookViewService";
import { CreateBookInput, UpdateBookInput } from "schemas/BookSchema";

export class BookServiceOrchestrator {
    static async createBook(
        createBookInput: CreateBookInput,
        file?: {
            file: Buffer<ArrayBufferLike>,
            mimeType: string
        }
    ): Promise<BookView>{
        // remove genre_ids from createBookInput if it exists
        const genre_ids = createBookInput.genre_ids;
        if(genre_ids)
            delete createBookInput.genre_ids;

        const newBook = await BookService.addBook(
            createBookInput, 
            file
        );
    
        // add book genres if provided
        if(genre_ids && genre_ids.length > 0){
            const bookgenres = genre_ids.map(genre_id => ({
                book_id: newBook.book_id,
                genre_id
            }));
    
            await BookGenreService.addBookGenres(bookgenres)
        }
    
        return await BookViewService.fetchBookViewById(newBook.book_id);
    }
    
    static async deleteBook(book_id: string): Promise<boolean>{
        return await BookService.deleteBookById(book_id);
    }
    
    static async editBook(
        book_id: string,
        updateBookInput: UpdateBookInput,
        file?: {
            file: Buffer<ArrayBufferLike>,
            mimeType: string
        }
    ): Promise<BookView>{
        // remove genre_ids from updateBookInput if it exists
        const genre_ids = updateBookInput.genre_ids;
        if(genre_ids)
            delete updateBookInput.genre_ids;

        const editedBook = await BookService.editBookById(
            book_id, 
            updateBookInput,
            file
        );

        // this is to replace the existing book genres with the new ones provided in the updateBookInput
        if (genre_ids) {
            // delete existing book genres
            await BookGenreService.deleteBookGenresByBookId(book_id);

            // add new book genres
            const bookgenres = genre_ids.map(genre_id => ({
                book_id: editedBook.book_id,
                genre_id
            }));

            await BookGenreService.addBookGenres(bookgenres);
        }

        return await BookViewService.fetchBookViewById(editedBook.book_id);
    }
}