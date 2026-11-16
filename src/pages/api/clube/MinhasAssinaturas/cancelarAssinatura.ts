import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient'; // Ajuste o caminho se necessário

// Handler para cancelar uma assinatura
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Método da requisição:', req.method); // Log do método HTTP

  if (req.method === 'PUT') {
    // Log do corpo da requisição
    console.log('Corpo da requisição:', req.body);

    const { id_assinatura } = req.body;

    // Verifique se id_assinatura está presente
    if (!id_assinatura) {
      console.log('ID da assinatura não fornecido');
      return res.status(400).json({ error: 'ID da assinatura é obrigatório' });
    }

    try {
      console.log('Atualizando assinatura com ID:', id_assinatura);

      // Atualiza o status da assinatura para 'C' (Cancelada)
      const { data, error } = await supabase
        .from('assinatura')
        .update({ situacao_assinatura: 'C' })
        .eq('id_assinatura', id_assinatura)
        .single(); // Usa .single() para garantir que apenas uma linha seja afetada

      // Logs adicionais
      console.log('Dados retornados pelo Supabase:', data);
      console.log('Erro retornado pelo Supabase:', error);

      if (error) {
        console.error('Erro ao atualizar assinatura:', error);
        return res.status(500).json({ error: 'Erro ao atualizar assinatura' });
      }

      // Retorna sucesso
      res.status(200).json({ message: 'Assinatura cancelada com sucesso', data });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      res.status(500).json({ error: 'Erro ao cancelar assinatura' });
    }
  } else {
    console.log('Método não permitido:', req.method);
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
