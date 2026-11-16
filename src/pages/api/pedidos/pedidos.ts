import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[${new Date().toISOString()}] - Método ${req.method} recebido.`);

  if (req.method === 'GET') {
    // Listar pedidos
    const { id_usuario_clerk } = req.query;

    console.log(`[${new Date().toISOString()}] - GET pedido iniciado. id_usuario_clerk: ${id_usuario_clerk}`);

    if (!id_usuario_clerk) {
      console.error(`[${new Date().toISOString()}] - id_usuario_clerk não fornecido.`);
      return res.status(400).json({ error: 'id_usuario_clerk é obrigatório' });
    }

    try {
      const { data: pedidos, error } = await supabase
        .from('pedido')
        .select('*')
        .eq('id_usuario_clerk', id_usuario_clerk);

      if (error) {
        console.error(`[${new Date().toISOString()}] - Erro ao buscar pedidos: `, error);
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
      }

      console.log(`[${new Date().toISOString()}] - Pedidos encontrados: `, pedidos);

      // Buscar itens do pedido
      const pedidosComItens = await Promise.all(
        pedidos.map(async (pedido) => {
          console.log(`[${new Date().toISOString()}] - Buscando itens para o pedido ${pedido.id_pedido}.`);

          const { data: itens, error: itemError } = await supabase
            .from('item_pedido')
            .select('*')
            .eq('id_pedido', pedido.id_pedido);

          if (itemError) {
            console.error(`[${new Date().toISOString()}] - Erro ao buscar itens do pedido ${pedido.id_pedido}: `, itemError);
            return { ...pedido, itens: [] };
          }

          console.log(`[${new Date().toISOString()}] - Itens encontrados para o pedido ${pedido.id_pedido}: `, itens);
          return { ...pedido, itens };
        })
      );

      console.log(`[${new Date().toISOString()}] - Retornando pedidos com itens: `, pedidosComItens);
      res.status(200).json(pedidosComItens);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] - Erro ao buscar pedidos: `, error);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  if (req.method === 'POST') {
    // Criar novo pedido
    const { id_usuario_clerk, formapagto_pedido, valor_pedido, situacao_pedido, itens } = req.body;

    console.log(`[${new Date().toISOString()}] - POST pedido iniciado. Dados: `, req.body);

    if (!id_usuario_clerk || !formapagto_pedido || !valor_pedido || !situacao_pedido || !itens || itens.length === 0) {
      console.error(`[${new Date().toISOString()}] - Dados incompletos para criação do pedido.`);
      return res.status(400).json({ error: 'Dados incompletos para criação do pedido' });
    }

    try {
      const { data: novoPedido, error: pedidoError } = await supabase
        .from('pedido')
        .insert([{ id_usuario_clerk, data_pedido: new Date(), formapagto_pedido, valor_pedido, situacao_pedido }])
        .select()
        .single();

      if (pedidoError) {
        console.error(`[${new Date().toISOString()}] - Erro ao criar pedido: `, pedidoError);
        return res.status(500).json({ error: 'Erro ao criar pedido' });
      }

      console.log(`[${new Date().toISOString()}] - Pedido criado com sucesso: `, novoPedido);

      // Inserir itens do pedido
      interface ItemPedido {
        id_produto: number;
        quantidade_item: number;
        valor_item: number;
      }
      
      const itensPedido = itens.map((item: ItemPedido) => ({
        id_pedido: novoPedido.id_pedido,
        id_produto: item.id_produto,
        quantidade_item: item.quantidade_item,
        valor_item: item.valor_item,
        valortotal_item: item.valor_item * item.quantidade_item,
      }));

      console.log(`[${new Date().toISOString()}] - Itens do pedido a serem inseridos: `, itensPedido);

      const { error: itemError } = await supabase.from('item_pedido').insert(itensPedido);

      if (itemError) {
        console.error(`[${new Date().toISOString()}] - Erro ao inserir itens do pedido: `, itemError);
        return res.status(500).json({ error: 'Erro ao inserir itens do pedido' });
      }

      res.status(201).json({ message: 'Pedido criado com sucesso', pedido: novoPedido });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] - Erro ao criar pedido: `, error);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  if (req.method === 'PUT') {
    // Atualizar pedido
    const { id_pedido, situacao_pedido } = req.body;

    console.log(`[${new Date().toISOString()}] - PUT pedido iniciado. Dados: `, req.body);

    if (!id_pedido || !situacao_pedido) {
      console.error(`[${new Date().toISOString()}] - id_pedido e situacao_pedido são obrigatórios.`);
      return res.status(400).json({ error: 'id_pedido e situacao_pedido são obrigatórios' });
    }

    try {
      const { error } = await supabase
        .from('pedido')
        .update({ situacao_pedido })
        .eq('id_pedido', id_pedido);

      if (error) {
        console.error(`[${new Date().toISOString()}] - Erro ao atualizar pedido ${id_pedido}: `, error);
        return res.status(500).json({ error: 'Erro ao atualizar pedido' });
      }

      console.log(`[${new Date().toISOString()}] - Pedido ${id_pedido} atualizado com sucesso.`);
      res.status(200).json({ message: 'Pedido atualizado com sucesso' });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] - Erro ao atualizar pedido: `, error);
      res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }

  // Caso o método HTTP não seja GET, POST ou PUT
  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  console.error(`[${new Date().toISOString()}] - Método ${req.method} não permitido.`);
  res.status(405).end(`Método ${req.method} não permitido`);
}
