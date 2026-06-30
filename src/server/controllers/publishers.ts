const debug = require("debug")("Server:Publishers");

import { Request, Response } from "express"

import { PublisherService } from "@services/individual_services/PublisherService";
import { publisherCreate, publisherUpdate } from "@models/Publisher";

export const get_publisher_by_id = async (req: Request, res: Response) => {
    const publisher_id = req.params.publisher_id;

    if (typeof publisher_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    debug(`Fetching publisher with ID: ${publisher_id}`);

    const publisher = await PublisherService.fetchPublisherById(publisher_id);

    res.status(200).json({ data: publisher });
}

export const get_publishers = async (req: Request, res: Response) => {
    const name = req.query.name as string | undefined;

    if (name && typeof name !== "string")
        return res.status(400).json({ error: "Invalid name" });

    debug(`Fetching publishers with name: ${name}`);

    const publishers = await PublisherService.fetchPublishers(name);

    res.status(200).json({ data: publishers });
}

export const add_publisher = async (req: Request, res: Response) => {
    const publisherInput: unknown = req.body;

    if(publisherInput === undefined)
        return res.status(400).json({error: "Publisher data is required"});

    const parsed = publisherCreate.parse(publisherInput);

    const newPublisher = await PublisherService.addPublisher(parsed);

    res.status(200).json({data: newPublisher});
}

export const edit_publisher_by_id = async (req: Request, res: Response) => {
    const publisher_id = req.params.publisher_id;
    const bookUpdates: unknown = req.body;

    if (typeof publisher_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const parsed = publisherUpdate.parse(bookUpdates);

    debug(`Editing publisher with ID: ${publisher_id}`);

    const editedPublisher = await PublisherService.updatePublisher(publisher_id, parsed);

    res.status(200).json({ data: editedPublisher });
}

export const delete_publisher_by_id = async (req: Request, res: Response) => {
    const publisher_id = req.params.publisher_id;

    if (typeof publisher_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const response = await PublisherService.deletePublisher(publisher_id);

    res.status(200).json({ data: { success: response } });
} 