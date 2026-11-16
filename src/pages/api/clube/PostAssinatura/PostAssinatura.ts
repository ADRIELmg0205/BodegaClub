import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

// Inicialize o Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // Autenticação do Clerk
  const { userId } = getAuth(req);

  if (!userId) {
    console.error("ID do usuário Clerk não fornecido");
    return res.status(400).json({ error: 'Autenticação obrigatória' });
  }

  // Dados do corpo da requisição
  const { id_plano, valor_assinatura, mensalidade_assinatura, formapagto_assinatura, formaplano_assinatura, proximopagto_assinatura } = req.body;

  console.log("Dados recebidos:", {
    id_plano,
    valor_assinatura,
    mensalidade_assinatura,
    formapagto_assinatura,
    userId
  });

  try {
    // Inserir nova assinatura no Supabase
    const { data, error } = await supabase
      .from('assinatura')
      .insert([
        {
          id_plano,
          valor_assinatura,
          mensalidade_assinatura,
          formapagto_assinatura,
          id_usuario_clerk: userId,
          data_assinatura: new Date(), // Define a data de assinatura como a data atual
          situacao_assinatura: 'A', // Status inicial da assinatura
          formaplano_assinatura,
          proximopagto_assinatura
        }
      ]);

    console.log("Resultado da inserção no Supabase:", { data, error });

    if (error) {
      console.error("Erro ao inserir assinatura no Supabase:", error);
      throw error;
    }

    res.status(201).json({ message: 'Assinatura criada com sucesso', data });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    res.status(500).json({ error: 'Erro ao criar assinatura' });
  }
}
