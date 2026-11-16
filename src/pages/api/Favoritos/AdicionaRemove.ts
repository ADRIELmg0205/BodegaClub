import { supabase } from '@/lib/supabaseClient';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Requisição recebida:', req.method);  // Loga o método da requisição
  
  const { userId } = getAuth(req);
  console.log('Usuário autenticado:', userId);  // Loga o ID do usuário autenticado
  
  if (!userId) {
    console.log('Erro: Usuário não autenticado');
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (req.method === 'POST') {
    const { produtoId } = req.body;
    console.log('Produto a ser adicionado aos favoritos:', produtoId);  // Loga o produto a ser favoritado

    try {
      // Tentando adicionar o produto aos favoritos
      const { data, error } = await supabase
        .from('produtos_favoritos')
        .insert([{ id_usuario_clerk: userId, id_produto: produtoId }]);

      if (error) {
        console.log('Erro ao inserir no banco de dados:', error);  // Loga o erro de inserção
        throw error;
      }

      console.log('Produto adicionado com sucesso aos favoritos:', data);  // Loga o sucesso da inserção
      return res.status(200).json({ message: 'Produto adicionado aos favoritos' });
    } catch (error: any) {
      console.log('Erro no bloco try:', error.message);  // Loga o erro capturado
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { produtoId } = req.body;
    console.log('Produto a ser removido dos favoritos:', produtoId);  // Loga o produto a ser removido dos favoritos

    try {
      // Tentando remover o produto dos favoritos
      const { data, error } = await supabase
        .from('produtos_favoritos')
        .delete()
        .eq('id_usuario_clerk', userId)
        .eq('id_produto', produtoId);

      if (error) {
        console.log('Erro ao remover do banco de dados:', error);  // Loga o erro de remoção
        throw error;
      }

      console.log('Produto removido com sucesso dos favoritos:', data);  // Loga o sucesso da remoção
      return res.status(200).json({ message: 'Produto removido dos favoritos' });
    } catch (error: any) {
      console.log('Erro no bloco try:', error.message);  // Loga o erro capturado
      return res.status(500).json({ error: error.message });
    }
  } else {
    console.log('Método não permitido:', req.method);  // Loga métodos não permitidos
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
