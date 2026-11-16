import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface PlanoAssinatura {
  id_plano?: number;
  nome_plano: string;
  descricao_plano: string;
  imagem_plano: string;
  precomensal_plano: number;
  precosemestral_plano: number;
  precoanual_plano: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`Received ${req.method} request at /api/planos-assinatura`);

  if (req.method === 'GET') {
    try {
      console.log('Executing GET query to fetch all subscription plans');
      const { data, error } = await supabase
        .from('plano_assinatura')
        .select('id_plano, nome_plano, descricao_plano, imagem_plano, precomensal_plano, precosemestral_plano, precoanual_plano');

      if (error) {
        console.error('Error during GET query execution:', error);
        return res.status(500).json({ error: 'Failed to fetch subscription plans' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      console.error('Unexpected error during GET query execution:', error);
      res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  } else if (req.method === 'POST') {
    const { nome_plano, descricao_plano, imagem_plano, precomensal_plano, precosemestral_plano, precoanual_plano } = req.body as PlanoAssinatura;

    console.log('Received POST request with data:', {
      nome_plano,
      descricao_plano,
      imagem_plano,
      precomensal_plano,
      precosemestral_plano,
      precoanual_plano
    });

    try {
      console.log('Executing POST query to insert a new subscription plan');
      const { data, error } = await supabase
        .from('plano_assinatura')
        .insert([{ nome_plano, descricao_plano, imagem_plano, precomensal_plano, precosemestral_plano, precoanual_plano }])
        .select();

      if (error) {
        console.error('Error during POST query execution:', error);
        return res.status(500).json({ error: 'Failed to insert subscription plan' });
      }

      console.log('POST query result:', data[0]);
      res.status(201).json(data[0]);
    } catch (error: any) {
      console.error('Unexpected error during POST query execution:', error);
      res.status(500).json({ error: 'Failed to insert subscription plan' });
    }
  } else {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
