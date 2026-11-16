import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Inicialize o cliente do Supabase com as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface PlanoAssinatura {
  nome_plano: string;
  descricao_plano: string;
  imagem_plano: string;
  precomensal_plano: number;
  precosemestral_plano: number;
  precoanual_plano: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id_plano } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('plano_assinatura')
        .select('*')
        .eq('id_plano', id_plano)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    const { nome_plano, descricao_plano, imagem_plano, precomensal_plano, precosemestral_plano, precoanual_plano } = req.body as PlanoAssinatura;

    try {
      const { data, error } = await supabase
        .from('plano_assinatura')
        .update({
          nome_plano,
          descricao_plano,
          imagem_plano,
          precomensal_plano,
          precosemestral_plano,
          precoanual_plano
        })
        .eq('id_plano', id_plano)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { data, error } = await supabase
        .from('plano_assinatura')
        .delete()
        .eq('id_plano', id_plano)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Plano não encontrado' });
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
