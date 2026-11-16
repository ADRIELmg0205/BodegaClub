import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Ou a conexão com o banco que você usa
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Requisição recebida na rota /api/Favoritos');
  console.log('Método da requisição:', req.method);
  
  if (req.method === 'GET') {
    try {
      console.log('Iniciando processo de autenticação...');
      // Substitua pela lógica de autenticação que você utiliza (ex: Clerk)
      const { userId } = getAuth(req); // Recuperar o usuário autenticado

      console.log('ID do usuário autenticado:', userId);

      if (!userId) {
        console.log('Usuário não autenticado. Retornando erro 401.');
        return res.status(401).json({ error: 'Não autorizado' });
      }

      console.log('Consultando favoritos no banco de dados para o userId:', userId);

      // Substitua "favoritos" pela sua tabela de favoritos no banco de dados
      const { data, error } = await supabase
        .from('produtos_favoritos')
        .select('id_produto')
        .eq('id_usuario_clerk', userId); // Filtrar pelo ID do usuário logado

      if (error) {
        console.error('Erro ao buscar favoritos no banco de dados:', error);
        return res.status(500).json({ error: 'Erro ao buscar favoritos' });
      }

      console.log('Favoritos retornados pelo banco de dados:', data);

      return res.status(200).json(data);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    console.log(`Método ${req.method} não permitido. Permitido apenas GET.`);
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
