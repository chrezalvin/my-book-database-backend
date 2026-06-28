import {supabase, PASSWORD_HASH_MODE} from "@configs"
import { isEmail } from "@library";
import {User, userModel} from "@models/User"

import {createHash} from "crypto"

export class UserService {
    static tableName = "users";

    static async loginUser(email: User["email"], password: User["password"]){
        // hash to sha256
        const hash = createHash(PASSWORD_HASH_MODE).update(password).digest("hex");
    
        const {data, error} = await supabase
            .from(UserService.tableName)
            .select("*")
            .eq("email", email)
            .eq("password", hash)
            .single();
    
        if (error)
            throw new Error(`Error logging in user with email ${email}: ${error.message}`);
    
        const parsed = userModel.parse(data);
    
        return parsed;
    }
    
    static async addUser(email: User["email"], password: User["password"]){
        if(!isEmail(email))
            throw new Error(`Invalid email format`);
    
        const hash = createHash(PASSWORD_HASH_MODE).update(password).digest("hex");
    
        const {data, error} = await supabase
            .from(UserService.tableName)
            .insert({email, password: hash})
            .select()
            .single();
    
        if (error)
            throw new Error(`Error adding new user: ${error.message}`);
    
        const parsed = userModel.parse(data);
    
        return parsed;
    }
    
    static async fetchUserByIdAndEmail(user_id: User["user_id"], email: User["email"]) {
        const {data, error} = await supabase
            .from(UserService.tableName)
            .select("*")
            .eq("user_id", user_id)
            .eq("email", email)
            .single();
    
        if (error)
            throw new Error(`Error fetching user with ID ${user_id}: ${error.message}`);
    
        const parsed = userModel.parse(data);
    
        return parsed;
    }
}