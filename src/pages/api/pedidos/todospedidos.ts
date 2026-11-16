import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Importe a configuração do Supabase conforme necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
            clerk_user_id,
            first_name,
            last_name,
            email
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
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
