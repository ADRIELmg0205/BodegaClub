import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Configuração do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Iniciando handler da API');
  console.log('Método da requisição:', req.method);

  if (req.method === 'GET') {
    const { id_usuario_clerk } = req.query;
    console.log('Requisição GET recebida');
    console.log('ID do usuário (query):', id_usuario_clerk);

    if (!id_usuario_clerk) {
      console.log('ID do usuário não fornecido para GET');
      return res.status(400).json({ message: 'ID do usuário não fornecido' });
    }

    try {
      console.log('Buscando gostos do usuário no banco de dados');
      const { data: usuario, error: fetchError } = await supabase
        .from('users')
        .select('gostos')
        .eq('clerk_user_id', id_usuario_clerk)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar gostos no banco de dados:', fetchError);
        throw fetchError;
      }

      if (!usuario) {
        console.log('Usuário não encontrado');
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      console.log('Gostos do usuário encontrados:', usuario.gostos);
      return res.status(200).json({ gostos: usuario.gostos });
    } catch (error: any) {
      console.error('Erro ao buscar os gostos do usuário:', error);
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    const { idUsuarioClerk, gostos } = req.body;

    console.log('Requisição POST recebida');
    console.log('ID do usuário (body):', idUsuarioClerk);
    console.log('Gostos (body):', gostos);

    // Verifica se os dados são fornecidos
    if (!idUsuarioClerk || gostos === undefined) {
      console.log('ID do usuário ou gostos não fornecidos para POST');
      return res.status(400).json({ message: 'ID do usuário e gostos são obrigatórios' });
    }

    try {
      console.log('Atualizando gostos do usuário no banco de dados');
      const { error: updateError } = await supabase
        .from('users')
        .update({ gostos })
        .eq('clerk_user_id', idUsuarioClerk);

      if (updateError) {
        console.error('Erro ao atualizar gostos no banco de dados:', updateError);
        throw updateError;
      }

      console.log('Gostos atualizados com sucesso!');
      return res.status(200).json({ message: 'Gostos atualizados com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao atualizar os gostos do usuário:', error);
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  } else {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
