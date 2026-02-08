const debug = require("debug")("Models:Book");

export interface Book{
    book_id: string;
    created_at: string;
    title: string;
    author: string;
    publisher: string;
    publication_year: number;
    language: string;
    genre: string;
    summary: string;
    
    cover_img: string | null;
    isbn: string | null;
    edition: string | null;
}

export function isBook(value: unknown): value is Book {
    if(typeof value !== "object" || value === null){
        debug("Value is not an object or is null");
        return false;
    }

    if(!("book_id" in value)){
        debug("Missing 'book_id' property");
        return false;
    }

    if(!("user_id" in value)){
        debug("Missing 'user_id' property");
        return false;
    }

    if(!("created_at" in value)){
        debug("Missing 'created_at' property");
        return false;
    }

    if(!("title" in value)){
        debug("Missing 'title' property");
        return false;
    }

    if(!("author" in value)){
        debug("Missing 'author' property");
        return false;
    }

    if(!("publication_year" in value)){
        debug("Missing 'publication_year' property");
        return false;
    }

    if(!("language" in value)){
        debug("Missing 'language' property");
        return false;
    }

    if(!("genre" in value)){
        debug("Missing 'genre' property");
        return false;
    }

    if(!("summary" in value)){
        debug("Missing 'summary' property");
        return false;
    }

    if(("isbn" in value) && value.isbn !== null && typeof value.isbn !== "string"){
        debug("'isbn' property is not a string or null");
        return false;
    }

    if(("edition" in value) && value.edition !== null && typeof value.edition !== "string"){
        debug("'edition' property is not a string or null");
        return false;
    }

    if(("cover_img" in value) && value.cover_img !== null && typeof value.cover_img !== "string"){
        debug("'cover_img' property is not a string or null");
        return false;
    }

    if(typeof value.book_id !== "string"){
        debug("'book_id' property is not a string");
        return false;
    }

    if(typeof value.created_at !== "string"){
        debug("'created_at' property is not a string");
        return false;
    }

    if(typeof value.title !== "string"){
        debug("'title' property is not a string");
        return false;
    }

    if(typeof value.author !== "string"){
        debug("'author' property is not a string");
        return false;
    }

    if(typeof value.publication_year !== "number"){
        debug("'publication_year' property is not a number");
        return false;
    }

    if(typeof value.language !== "string"){
        debug("'language' property is not a string");
        return false;
    }

    if(typeof value.genre !== "string"){
        debug("'genre' property is not a string");
        return false;
    }

    if(typeof value.summary !== "string"){
        debug("'summary' property is not a string");
        return false;
    }

    return true;
}

export function isBookWithoutId(value: unknown): value is Omit<Book, "book_id" | "created_at" | "cover_img"> {
    if(typeof value !== "object" || value === null){
        debug("Value is not an object or is null");
        return false;
    }

    if("book_id" in value){
        debug("Should not have 'book_id' property");
        return false;
    }

    if("created_at" in value){
        debug("Should not have 'created_at' property");
        return false;
    }

    if("cover_img" in value){
        debug("Should not have 'cover_img' property");
        return false;
    }

    if(!("title" in value)){
        debug("Missing 'title' property");
        return false;
    }

    if(!("author" in value)){
        debug("Missing 'author' property");
        return false;
    }

    if(!("publication_year" in value)){
        debug("Missing 'publication_year' property");
        return false;
    }

    if(!("language" in value)){
        debug("Missing 'language' property");
        return false;
    }

    if(!("genre" in value)){
        debug("Missing 'genre' property");
        return false;
    }

    if(!("summary" in value)){
        debug("Missing 'summary' property");
        return false;
    }

    if(("isbn" in value) && value.isbn !== null && typeof value.isbn !== "string"){
        debug("'isbn' property is not a string or null");
        return false;
    }

    if(("edition" in value) && value.edition !== null && typeof value.edition !== "string"){
        debug("'edition' property is not a string or null");
        return false;
    }

    if(typeof value.title !== "string"){
        debug("'title' property is not a string");
        return false;
    }

    if(typeof value.author !== "string"){
        debug("'author' property is not a string");
        return false;
    }

    if(typeof value.publication_year !== "number"){
        debug("'publication_year' property is not a number");
        return false;
    }

    if(typeof value.language !== "string"){
        debug("'language' property is not a string");
        return false;
    }

    if(typeof value.genre !== "string"){
        debug("'genre' property is not a string");
        return false;
    }

    if(typeof value.summary !== "string"){
        debug("'summary' property is not a string");
        return false;
    }

    return true;
}

export function isBookPartial(value: unknown): value is Partial<Omit<Book, "book_id" | "created_at" | "cover_img">> {
    if(typeof value !== "object" || value === null){
        debug("Value is not an object or is null");
        return false;
    }

    if("book_id" in value){
        debug("Should not have 'book_id' property");
        return false;
    }

    if("created_at" in value){
        debug("Should not have 'created_at' property");
        return false;
    }

    if("cover_img" in value){
        debug("Should not have 'cover_img' property");
        return false;
    }

    if("title" in value && typeof value.title !== "string"){
        debug("'title' property is not a string");
        return false;
    }

    if("author" in value && typeof value.author !== "string"){
        debug("'author' property is not a string");
        return false;
    }

    if("publication_year" in value && typeof value.publication_year !== "number"){
        debug("'publication_year' property is not a number");
        return false;
    }

    if("language" in value && typeof value.language !== "string"){
        debug("'language' property is not a string");
        return false;
    }

    if("genre" in value && typeof value.genre !== "string"){
        debug("'genre' property is not a string");
        return false;
    }

    if("summary" in value && typeof value.summary !== "string"){
        debug("'summary' property is not a string");
        return false;
    }

    if("isbn" in value && value.isbn !== null && typeof value.isbn !== "string"){
        debug("'isbn' property is not a string or null");
        return false;
    }

    if("edition" in value && value.edition !== null && typeof value.edition !== "string"){
        debug("'edition' property is not a string or null");
        return false;
    }

    return true;
}