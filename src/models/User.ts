const debug = require("debug")("Models:User");

export interface User{
    user_id: string;
    created_at: string;
    email: string;
    password: string;
}

export function isUser(value: unknown): value is User {
    if(typeof value !== "object" || value === null){
        debug("Value is not an object or is null");
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

    if(!("email" in value)){
        debug("Missing 'email' property");
        return false;
    }

    if(!("password" in value)){
        debug("Missing 'password' property");
        return false;
    }

    if(typeof value.user_id !== "string"){
        debug("'user_id' property is not a string");
        return false;
    }

    if(typeof value.email !== "string"){
        debug("'email' property is not a string");
        return false;
    }

    if(typeof value.password !== "string"){
        debug("'password' property is not a string");
        return false;
    }

    if(typeof value.created_at !== "string"){
        debug("'created_at' property is not a string");
        return false;
    }    

    return true;
}