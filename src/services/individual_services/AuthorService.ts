import {supabase} from "@configs"
import { Author, AuthorCreate, authorModel, AuthorUpdate } from "@models/Author";
import { PAGINATION_NUMBER } from "@configs";

const debug = require("debug")("Server:AuthorService");

export class AuthorService {
    static authorTableName = "authors";

    static async fetchAuthorById(author_id: Author["author_id"]): Promise<Author> {
        const {data, error} = await supabase
            .from(AuthorService.authorTableName)
            .select("*")
            .eq("author_id", author_id)
            .single();

        if (error)
            throw new Error(`Error fetching author with ID ${author_id}: ${error.message}`);

        const parsed = authorModel.parse(data);

        return parsed;
    }

    static async fetchAuthors(name?: string): Promise<Author[]> {
        let query = supabase
            .from(AuthorService.authorTableName)
            .select("*");

        if (name)
            query = query.ilike("author_name", `%${name}%`);

        query = query.limit(PAGINATION_NUMBER);

        const {data, error} = await query;

        if (error)
            throw new Error(`Error fetching authors: ${error.message}`);

        const unknown_data = data as unknown[];

        const parsed = unknown_data.map((author) => authorModel.parse(author));

        return parsed;
    }

    static async addAuthor(author: AuthorCreate): Promise<Author> {
        const {data, error} = await supabase
            .from(AuthorService.authorTableName)
            .insert(author)
            .select()
            .single();

        if (error)
            throw new Error(`Error adding author: ${error.message}`);

        const parsed = authorModel.parse(data);

        return parsed;
    }

    static async updateAuthor(author_id: Author["author_id"], author: AuthorUpdate): Promise<Author> {
        const {data, error} = await supabase
            .from(AuthorService.authorTableName)
            .update(author)
            .eq("author_id", author_id)
            .select()
            .single();

        if (error)
            throw new Error(`Error updating author with ID ${author_id}: ${error.message}`);

        const parsed = authorModel.parse(data);

        return parsed;
    }

    static async deleteAuthor(author_id: Author["author_id"]): Promise<true> {
        const { error } = await supabase
            .from(AuthorService.authorTableName)
            .delete()
            .eq("author_id", author_id);

        if (error)
            throw new Error(`Error deleting author with ID ${author_id}: ${error.message}`);

        return true;
    }
}