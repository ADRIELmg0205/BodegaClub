import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Importe a configuração do Supabase conforme necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id_usuario_clerk } = req.query;

    try {
      // Consulta os pedidos junto com os itens e o nome do produto
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
            valortotal_item,
            produto:produto (
              nome_produto
            )
          )
        `)
        .eq('id_usuario_clerk', id_usuario_clerk);

        if (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
            return;
          }
    
          console.log('Pedidos retornados:', data);
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
