import { GenreView } from "@models/Views/GenreView";
import { GenreService } from "@services/individual_services/GenreService";
import { GenreViewService } from "@services/view_services/GenreViewService";
import { CreateGenreInput, UpdateGenreInput } from "schemas/GenreSchema";

export class GenreServiceOrchestrator {
    static async addGenre(genre: CreateGenreInput): Promise<GenreView> {
        const newGenre = await GenreService.addGenre(genre);

        const genreView = await GenreViewService.getGenreById(newGenre.genre_id);

        return genreView;
    }

    static async editGenreById(genre_id: string, genre: UpdateGenreInput): Promise<GenreView> {
        const updatedGenre = await GenreService.updateGenreById(genre_id, genre);

        const genreView = await GenreViewService.getGenreById(updatedGenre.genre_id);

        return genreView;
    }

    static async deleteGenreById(genre_id: string): Promise<boolean> {
        return await GenreService.deleteGenreById(genre_id);
    }
}