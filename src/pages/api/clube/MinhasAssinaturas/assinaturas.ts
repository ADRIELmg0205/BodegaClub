import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Inicialize o Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_usuario_clerk } = req.query;

  // Log para verificar o id_usuario_clerk
  console.log("ID do usuário Clerk recebido:", id_usuario_clerk);

  if (!id_usuario_clerk) {
    console.error("ID do usuário Clerk não fornecido");
    return res.status(400).json({ error: 'ID do usuário Clerk é obrigatório' });
  }

  try {
    // Log para verificar se o Supabase foi inicializado corretamente
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Key:", supabaseKey ? "Chave encontrada" : "Chave não encontrada");

    // Query para buscar as assinaturas do usuário
    const { data, error } = await supabase
      .from('assinatura')
      .select(`
        id_assinatura,
        id_plano,
        data_assinatura,
        valor_assinatura,
        mensalidade_assinatura,
        situacao_assinatura,
        formapagto_assinatura,
        id_usuario_clerk,
        plano_assinatura (nome_plano),
        usuario:users (
            clerk_user_id,
            first_name,
            last_name,
            email
          )
      `)
      .eq('id_usuario_clerk', id_usuario_clerk);

    // Log para verificar a resposta do Supabase
    console.log("Resposta do Supabase:", { data, error });

    if (error) {
      console.error("Erro na query do Supabase:", error);
      throw error;
    }

    // Retorna os dados para o frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error);
    res.status(500).json({ error: 'Erro ao buscar assinaturas' });
  }
}
