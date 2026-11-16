import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Certifique-se de que o caminho está correto

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  if (method === 'PUT') {
    console.log('Início da requisição para atualizar a situação do pedido');

    try {
      const { situacao_pedido } = req.body;

      if (!situacao_pedido || !['A', 'S', 'E', 'R', 'C'].includes(situacao_pedido)) {
        return res.status(400).json({ error: 'Situação do pedido inválida.' });
      }

      // Atualiza a situação do pedido
      const { data, error } = await supabase
        .from('pedido')
        .update({ situacao_pedido })
        .match({ id_pedido: id })
        .select('*')
        .single();

      // Log da resposta da consulta
      console.log('Resposta da atualização Supabase:', data);

      if (error) {
        console.error('Erro ao atualizar pedido:', error);
        return res.status(500).json({ error: 'Erro ao atualizar pedido' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro inesperado ao atualizar pedido:', error);
      res.status(500).json({ error: 'Erro inesperado ao atualizar pedido' });
    }
  } else if (method === 'GET') {
    console.log('Início da requisição para todos os pedidos');

    try {
      // Consulta os pedidos junto com os itens, informações do produto e dados do cliente
      const { data, error } = await supabase
        .from('pedido')
        .select(`
          id_pedido,
          valor_pedido,
          situacao_pedido,
          formapagto_pedido,
          data_pedido,
          usuario:users (
            first_name,
            last_name
          ),
          itens:item_pedido (
            id_item,
            id_produto,
            quantidade_item,
            valor_item,
            produto:produto (
              nome_produto
            )
          )
        `);

      // Log da resposta da consulta
      console.log('Resposta da consulta Supabase:', data);

      if (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
        return;
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro inesperado ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro inesperado ao buscar pedidos' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
