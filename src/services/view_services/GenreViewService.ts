import {supabase} from "@configs"
import { GenreView, genreViewModel } from "@models/Views/GenreView";

export class GenreViewService {
    static tableName = "vw_genres";
    
    static async fetchGenres(
        keyword?: string,
        exclude_genre_ids?: GenreView["genre_id"][]
    ): Promise<GenreView[]> {
        const {data, error} = await supabase
            .from(GenreViewService.tableName)
            .select("*")
            .ilike("genre_name", `%${keyword || ""}%`)
            .not("genre_id", "in", `(${exclude_genre_ids?.join(",") || ""})`)
            .limit(10);
    
        if (error)
            throw new Error(`Error fetching all genres: ${error.message}`);
    
        const unknown_data = data as unknown[];
        const genres: GenreView[] = [];
    
        for (const item of unknown_data){
            const parsed = genreViewModel.parse(item);
    
            genres.push(parsed);
        }
    
        return genres;
    }

    static async getGenreById(genre_id: GenreView["genre_id"]): Promise<GenreView>{
        const {data, error} = await supabase
            .from(GenreViewService.tableName)
            .select("*")
            .eq("genre_id", genre_id)
            .single();

        if (error)
            throw new Error(`Error fetching genre with ID ${genre_id}: ${error.message}`);

        const parsed = genreViewModel.parse(data);

        return parsed;
    }
}