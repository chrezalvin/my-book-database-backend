import {supabase, PASSWORD_HASH_MODE} from "@configs"
import { isEmail } from "@library";
import {isUser, User} from "@models/User"

import {createHash} from "crypto"

const tableName = "users";
export const loginUser = async (email: User["email"], password: User["password"]) => {
    // hash to sha256
    const hash = createHash(PASSWORD_HASH_MODE).update(password).digest("hex");

    const {data, error} = await supabase
        .from(tableName)
        .select("*")
        .eq("email", email)
        .eq("password", hash)
        .single();

    if (error)
        throw new Error(`Error logging in user with email ${email}: ${error.message}`);

    if(!isUser(data))
        throw new Error(`Fetched data is not a valid User object for email ${email}`);

    return data;
}

export const addUser = async (email: User["email"], password: User["password"]) => {
    if(!isEmail(email))
        throw new Error(`Invalid email format`);

    const hash = createHash(PASSWORD_HASH_MODE).update(password).digest("hex");

    const {data, error} = await supabase
        .from(tableName)
        .insert({email, password: hash})
        .select()
        .single();

    if (error)
        throw new Error(`Error adding new user: ${error.message}`);

    if(!isUser(data))
        throw new Error(`Inserted data is not a valid User object`);

    return data;
}

export const fetchUserByIdAndEmail = async (user_id: User["user_id"], email: User["email"]) => {
    const {data, error} = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", user_id)
        .eq("email", email)
        .single();

    if (error)
        throw new Error(`Error fetching user with ID ${user_id}: ${error.message}`);

    if(!isUser(data))
        throw new Error(`Fetched data is not a valid User object for ID ${user_id}`);

    return data;
}