import { createClient } from '@supabase/supabase-js';

// URL e chave da sua instância do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cria o cliente do Supabase usando a URL e chave de API
export const supabase = createClient(supabaseUrl, supabaseKey);
