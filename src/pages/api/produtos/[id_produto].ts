import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Inicialize o cliente do Supabase com as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Produto {
  nome_produto: string;
  preco_produto: number;
  descricao_produto: string;
  tipo_produto: string;
  imagem_produto: string;
  principal_produto: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id_produto } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('produto')
        .select('*')
        .eq('id_produto', id_produto)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    const { nome_produto, preco_produto, descricao_produto, tipo_produto, imagem_produto, principal_produto } = req.body as Produto;

    try {
      const { data, error } = await supabase
        .from('produto')
        .update({
          nome_produto,
          preco_produto,
          descricao_produto,
          tipo_produto,
          imagem_produto,
          principal_produto
        })
        .eq('id_produto', id_produto)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { data, error } = await supabase
        .from('produto')
        .delete()
        .eq('id_produto', id_produto)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
