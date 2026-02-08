import configs from "../config.json"
import { createClient } from "@supabase/supabase-js"

export const PORT = configs.PORT

export const SUPABASE_URL = configs.SUPABASE_URL
export const SUPABASE_KEY = configs.SUPABASE_KEY
export const PASSWORD_HASH_MODE = configs.PASSWORD_HASH_MODE

export const JWT_SECRET = configs.JWT_SECRET
export const JWT_EXPIRATION = configs.JWT_EXPIRATION

export const PAGINATION_NUMBER = configs.PAGINATION_NUMBER

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)