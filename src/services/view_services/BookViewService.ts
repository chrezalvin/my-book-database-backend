import {supabase} from "@configs"
import { getPagination } from "@library";
import { BookView, bookViewModel } from "@models/Views/BookView";

const debug = require("debug")("Server:BookViewService");

export class BookViewService{
    static tableName = "vw_books";
    static bucketName = "books";
    
    static translateBookCoverPathToUrl(cover_img_path: string): string {
        return supabase
            .storage
            .from(BookViewService.bucketName)
            .getPublicUrl(cover_img_path)
            .data
            .publicUrl;
    }
    
    static async fetchBookViewsByPage(page: number, pageSize: number, keyword?: string): Promise<BookView[]> {
        const {from, to} = getPagination(page, pageSize);
    
        const {data, error} = await supabase
            .from(BookViewService.tableName)
            .select("*")
            .range(from, to - 1) // Supabase range is inclusive, so we use to - 1
            .ilike("title", keyword ? `%${keyword}%` : "%%")
            .order("created_at", {ascending: false});

        debug(`Fetched book views for page ${page} with keyword "${keyword}": ${JSON.stringify(data)}`);
    
        if (error)
            throw new Error(`Error fetching book views for page ${page}: ${error.message}`);
    
        const unknown_data = data as unknown[];
        const book_views: BookView[] = [];
    
        for (const item of unknown_data){
            const parsed = bookViewModel.parse(item);
    
            if(parsed.cover_img)
                parsed.cover_img = BookViewService.translateBookCoverPathToUrl(parsed.cover_img);
    
            book_views.push(parsed);
        }
    
        return book_views;
    }
    
    static async fetchBookViewById(book_id: BookView["book_id"]): Promise<BookView> {
        const {data, error} = await supabase
            .from(BookViewService.tableName)
            .select("*")
            .eq("book_id", book_id)
            .single();
    
        if (error)
            throw new Error(`Error fetching book view with ID ${book_id}: ${error.message}`);
    
        const parsed = bookViewModel.parse(data);
    
        if(parsed.cover_img)
            parsed.cover_img = BookViewService.translateBookCoverPathToUrl(parsed.cover_img);
    
        return parsed;
    }
}