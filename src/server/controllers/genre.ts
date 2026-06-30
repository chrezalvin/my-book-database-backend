import { GenreServiceOrchestrator } from "@services/orchestrators/GenreServiceOrchestrator";
import { GenreViewService } from "@services/view_services/GenreViewService";
import {Request, Response} from "express"
import { createGenreSchema, updateGenreSchema } from "schemas/GenreSchema";

const debug = require("debug")("Server:Genre");

export const get_genres = async (req: Request, res: Response) => {
    debug("Fetching all genres");

    const keyword = req.query.keyword;
    const exclude_genre_ids = req.query.exclude_genre_ids == undefined ? undefined : (req.query.exclude_genre_ids as string).split(",");

    if (keyword && typeof keyword !== "string")
        return res.status(400).json({ error: "Invalid keyword" });
    
    const genres = await GenreViewService.fetchGenres(keyword, exclude_genre_ids);

    res.status(200).json({ data: genres });
}

export const add_genre = async (req: Request, res: Response) => {
    const data: unknown = req.body;

    debug(`Received add genre request: ${JSON.stringify(data)}`);
    
    if(data === undefined)
        return res.status(400).json({error: "Genre data is required"});
    
    const parsed = createGenreSchema.parse(data);
    
    debug(`Adding new genre: ${JSON.stringify(data)}`);

    const newGenre = await GenreServiceOrchestrator.addGenre(parsed);

    res.status(200).json({data: newGenre});
}

export const edit_genre_by_id = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const genre_id = req.params.genre_id;
    const data: unknown = req.body;

    if (typeof genre_id !== "string")
        return res.status(400).json({ error: "Invalid genre ID" });

    if(data === undefined)
        return res.status(400).json({error: "Genre data is required"});

    const parsed = updateGenreSchema.parse(data);

    const updatedGenre = await GenreServiceOrchestrator.editGenreById(genre_id, parsed);

    res.status(200).json({data: updatedGenre});
}

export const delete_genre_by_id = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const genre_id = req.params.genre_id;

    if (typeof genre_id !== "string")
        return res.status(400).json({ error: "Invalid genre ID" });

    const isDeleted = await GenreServiceOrchestrator.deleteGenreById(genre_id);

    if(!isDeleted)
        return res.status(500).json({error: `Failed to delete genre with ID ${genre_id}`});

    res.status(200).json({data: {message: `Genre with ID ${genre_id} deleted successfully`}});
}