import {supabase} from "@configs"
import { Genre, GenreCreate, genreModel, GenreUpdate } from "@models/Genre";

export class GenreService {
    static tableName = "genres";
    
    static async addGenre(genre: GenreCreate): Promise<Genre> {
        // find if genre already exists
        const found = await supabase
            .from(GenreService.tableName)
            .select("*")
            .ilike("genre_name", genre.genre_name)
            .single();

        if (found.data)
            throw new Error(`Genre with name ${genre.genre_name} already exists`);

        const {data, error} = await supabase
            .from(GenreService.tableName)
            .insert(genre)
            .select()
            .single();
    
        if (error)
            throw new Error(`Error adding new genre: ${error.message}`);
    
        const parsed = genreModel.parse(data);
    
        return parsed;
    }

    static async updateGenreById(genre_id: Genre["genre_id"], genre: GenreUpdate): Promise<Genre> {
        const {data, error} = await supabase
            .from(GenreService.tableName)
            .update(genre)
            .eq("genre_id", genre_id)
            .select()
            .single();

        if (error)
            throw new Error(`Error updating genre with ID ${genre_id}: ${error.message}`);

        const parsed = genreModel.parse(data);

        return parsed;
    }
    
    static async deleteGenreById(genre_id: Genre["genre_id"]): Promise<boolean> {
        const { error } = await supabase
            .from(GenreService.tableName)
            .delete()
            .eq("genre_id", genre_id);
    
        if (error)
            throw new Error(`Error deleting genre with ID ${genre_id}: ${error.message}`);
    
        return true;
    }
}