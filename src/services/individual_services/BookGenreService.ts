import { supabase } from "@configs";
import { BookGenre, bookGenreModel } from "@models/BookGenre";

export class BookGenreService {
    static tableName = "book_genres";
    
    static async addBookGenres(bookGenres: BookGenre[]): Promise<BookGenre[]> {
        const { data, error } = await supabase
            .from(BookGenreService.tableName)
            .insert(bookGenres)
            .select();  
            
        if (error)
            throw new Error(`Error adding book genres: ${error.message}`);

        const unknown_data = data as unknown;

        if (!Array.isArray(unknown_data))
            throw new Error(`Unexpected data format when adding book genres`);

        const addedBookGenres: BookGenre[] = [];
        for (const item of unknown_data) {
            const parsed = bookGenreModel.parse(item);
            addedBookGenres.push(parsed);
        }
    
        return addedBookGenres;
    }

    static async addBookGenre(bookGenre: BookGenre): Promise<BookGenre> {
        const { data, error } = await supabase
            .from(BookGenreService.tableName)
            .insert(bookGenre)
            .select()
            .single();

        if (error)
            throw new Error(`Error adding book genre for book_id ${bookGenre.book_id} and genre_id ${bookGenre.genre_id}: ${error.message}`);

        const parsed = bookGenreModel.parse(data);

        return parsed;
    }
    
    static async deleteBookGenre(bookGenre: BookGenre): Promise<true> {
        const { error } = await supabase
            .from(BookGenreService.tableName)
            .delete()
            .eq("book_id", bookGenre.book_id)
            .eq("genre_id", bookGenre.genre_id);
    
        if (error)
            throw new Error(`Error deleting book genres for book_id ${bookGenre.book_id} and genre_id ${bookGenre.genre_id}: ${error.message}`);
    
        return true;
    }

    static async deleteBookGenresByBookId(book_id: BookGenre["book_id"]): Promise<true> {
        const { error } = await supabase
            .from(BookGenreService.tableName)
            .delete()
            .eq("book_id", book_id);

        if (error)
            throw new Error(`Error deleting book genres for book_id ${book_id}: ${error.message}`);

        return true;
    }
}