import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente do Supabase com as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const payload = req.body;

  // Log para depuração
  console.log('Received payload:', payload);

  if (payload.type === 'user.created') {
    const user = payload.data;

    // Captura informações do usuário e registra no banco de dados
    await registerUser(user);
  }

  res.status(200).send('Success');
}

async function registerUser(user) {
  const { id, email_addresses, first_name, last_name } = user;
  const email = email_addresses[0].email_address;
  const createdAt = new Date();

  const { data, error } = await supabase
    .from('users')
    .upsert({
      clerk_user_id: id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      created_at: createdAt,
    }, {
      onConflict: ['email']
    });

  if (error) {
    console.error('Erro ao registrar ou atualizar usuário no banco de dados:', error);
  } else {
    console.log('Usuário registrado ou atualizado no banco de dados:', data);
  }
}
