import { User } from "./User";

const debug = require("debug")("Models:Jwt");

export interface Jwt{
    user_id: User["user_id"];
    email: string;
    iat: number;
    exp: number;
}

export function isJwt(value: unknown): value is Jwt {
    if(typeof value !== "object" || value === null){
        return false;
    }

    if(!("user_id" in value)){
        debug("Missing 'user_id' property");
        return false;
    }

    if(!("email" in value)){
        debug("Missing 'email' property");
        return false;
    }

    if(!("iat" in value)){
        debug("Missing 'iat' property");
        return false;
    }

    if(!("exp" in value)){
        debug("Missing 'exp' property");
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

    if(typeof value.iat !== "number"){
        debug("'iat' property is not a number");
        return false;
    }

    if(typeof value.exp !== "number"){
        debug("'exp' property is not a number");
        return false;
    }

    return true;
}