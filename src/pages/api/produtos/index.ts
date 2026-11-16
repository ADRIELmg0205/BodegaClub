import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Produto {
  id_produto: number;
  nome_produto: string;
  preco_produto: number;
  descricao_produto: string;
  tipo_produto: string;
  imagem_produto: string;
  principal_produto: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`Received ${req.method} request at /api/produtos`);

  if (req.method === 'GET') {
    try {
      console.log('Executing GET query to fetch all products');
      const { tipo_produto, exclude, view } = req.query;
      let query = supabase.from('produto').select('*');

      if (tipo_produto !== undefined || exclude !== undefined) {
        const excludeId = typeof exclude === 'string' ? Number(exclude) : NaN;

        if (typeof tipo_produto !== 'string' || !Number.isInteger(excludeId)) {
          return res.status(400).json({ error: 'Invalid suggestion filters' });
        }

        query = supabase
          .from('produto')
          .select('id_produto, nome_produto, preco_produto, tipo_produto, imagem_produto')
          .eq('tipo_produto', tipo_produto)
          .neq('id_produto', excludeId);
      } else if (view === 'listing') {
        query = supabase
          .from('produto')
          .select('id_produto, nome_produto, preco_produto, descricao_produto, tipo_produto, imagem_produto');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error during GET query execution:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      console.error('Unexpected error during GET query execution:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    const { nome_produto, preco_produto, descricao_produto, tipo_produto, imagem_produto, principal_produto } = req.body as Produto;

    console.log('Received POST request with data:', {
      nome_produto,
      preco_produto,
      descricao_produto,
      tipo_produto,
      imagem_produto,
      principal_produto
    });

    try {
      console.log('Executing POST query to insert a new product');
      const { data, error } = await supabase
        .from('produto')
        .insert([{ nome_produto, preco_produto, descricao_produto, tipo_produto, imagem_produto, principal_produto }])
        .select();

      if (error) {
        console.error('Error during POST query execution:', error);
        return res.status(500).json({ error: 'Failed to insert product' });
      }

      console.log('POST query result:', data[0]);
      res.status(201).json(data[0]);
    } catch (error: any) {
      console.error('Unexpected error during POST query execution:', error);
      res.status(500).json({ error: 'Failed to insert product' });
    }
  } else {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
