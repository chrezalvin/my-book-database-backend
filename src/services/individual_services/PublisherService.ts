import {supabase} from "@configs"
import { Publisher, PublisherCreate, PublisherUpdate, publisherModel } from "@models/Publisher";

const debug = require("debug")("Server:PublisherService");

export class PublisherService {
    static publisherTableName = "publishers";

    static async fetchPublisherById(publisher_id: Publisher["publisher_id"]): Promise<Publisher> {
        const {data, error} = await supabase
            .from(PublisherService.publisherTableName)
            .select("*")
            .eq("publisher_id", publisher_id)
            .single()

        if(error)
            throw new Error(`Error fetching publisher with ID ${publisher_id}: ${error.message}`)

        const parsed = publisherModel.parse(data);

        return parsed;
    }

    static async addPublisher(publisher: PublisherCreate): Promise<Publisher> {
        const {data, error} = await supabase
            .from(PublisherService.publisherTableName)
            .insert(publisher)
            .select()
            .single()

        if(error)
            throw new Error(`Error adding publisher: ${error.message}`)

        const parsed = publisherModel.parse(data);

        return parsed;
    }

    static async updatePublisher(publisher_id: Publisher["publisher_id"], publisher: PublisherUpdate): Promise<Publisher> {
        const {data, error} = await supabase
            .from(PublisherService.publisherTableName)
            .update(publisher)
            .eq("publisher_id", publisher_id)
            .select()
            .single()

        if(error)
            throw new Error(`Error updating publisher with ID ${publisher_id}: ${error.message}`)

        const parsed = publisherModel.parse(data);

        return parsed;
    }

    static async deletePublisher(publisher_id: Publisher["publisher_id"]): Promise<true> {
        const { error } = await supabase
            .from(PublisherService.publisherTableName)
            .delete()
            .eq("publisher_id", publisher_id)

        if (error)
            throw new Error(`Error deleting publisher with ID ${publisher_id}: ${error.message}`)

        return true;
    }
}