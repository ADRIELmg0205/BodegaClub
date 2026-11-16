import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Ou a conexão com o banco que você usa
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Requisição recebida na rota /api/Favoritos');
  console.log('Método da requisição:', req.method);

  // Verificar se o método da requisição é GET
  if (req.method === 'GET') {
    try {
      console.log('Iniciando processo de autenticação...');
      
      // Recuperar o usuário autenticado
      const { userId } = getAuth(req);
      console.log('Autenticação concluída, ID do usuário autenticado:', userId);

      if (!userId) {
        console.log('Falha na autenticação: Usuário não autenticado.');
        return res.status(401).json({ error: 'Não autorizado' });
      }

      console.log('Iniciando consulta de produtos favoritos para o userId:', userId);

      // Consulta para buscar todos os dados dos produtos favoritos
      const { data, error } = await supabase
        .from('produtos_favoritos')
        .select(`
          id_produto,
          produto (
            id_produto,
            nome_produto,
            preco_produto,
            descricao_produto,
            tipo_produto,
            principal_produto,
            imagem_produto,
            estoque_produto
          )
        `)
        .eq('id_usuario_clerk', userId); // Filtrar pelo ID do usuário logado
      
      console.log('Resultado da consulta do supabase:', data);
      if (error) {
        console.error('Erro ao buscar produtos favoritos no banco de dados:', error);
        return res.status(500).json({ error: 'Erro ao buscar favoritos no banco de dados' });
      }

      if (!data || data.length === 0) {
        console.log('Nenhum produto favorito encontrado para o usuário:', userId);
        return res.status(404).json({ message: 'Nenhum produto favorito encontrado' });
      }

      console.log('Produtos favoritos encontrados:', data);

      return res.status(200).json(data);
      
    } catch (err) {
      console.error('Erro ao processar a requisição:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    console.log(`Método ${req.method} não permitido. Permitido apenas GET.`);
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
