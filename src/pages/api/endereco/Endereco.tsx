import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Configuração do Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id_usuario_clerk, cep_endereco, estado_endereco, cidade_endereco, bairro_endereco, rua_endereco, numero_endereco, complemento_endereco } = req.body;

    try {
      // Verifica se já existe um endereço cadastrado para o id_usuario_clerk
      const { data: existingAddress, error: fetchError } = await supabase
        .from('endereco')
        .select('*')
        .eq('id_usuario_clerk', id_usuario_clerk)
        .single(); // single() garante que apenas um registro seja retornado

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Caso ocorra erro ao buscar o endereço (exceto 404, que significa que não há endereço)
        throw fetchError;
      }

      if (existingAddress) {
        // Se o endereço já existir, faça um UPDATE
        const { error: updateError } = await supabase
          .from('endereco')
          .update({
            cep_endereco,
            estado_endereco,
            cidade_endereco,
            bairro_endereco,
            rua_endereco,
            numero_endereco,
            complemento_endereco,
          })
          .eq('id_usuario_clerk', id_usuario_clerk);

        if (updateError) {
          throw updateError;
        }

        return res.status(200).json({ message: 'Endereço atualizado com sucesso!' });
      } else {
        // Se o endereço não existir, faça um INSERT
        const { error: insertError } = await supabase
          .from('endereco')
          .insert({
            id_usuario_clerk,
            cep_endereco,
            estado_endereco,
            cidade_endereco,
            bairro_endereco,
            rua_endereco,
            numero_endereco,
            complemento_endereco,
          });

        if (insertError) {
          throw insertError;
        }

        return res.status(201).json({ message: 'Endereço criado com sucesso!' });
      }
    } catch (error: any) {
      console.error('Erro ao salvar o endereço:', error);
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  } else if (req.method === 'GET') {
    // Adicionando suporte ao método GET
    const { id_usuario_clerk } = req.query;

    try {
      // Busca o endereço correspondente ao id_usuario_clerk
      const { data: endereco, error: fetchError } = await supabase
        .from('endereco')
        .select('*')
        .eq('id_usuario_clerk', id_usuario_clerk)
        .single(); // single() garante que apenas um registro seja retornado

      if (fetchError) {
        throw fetchError;
      }

      if (!endereco) {
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }

      return res.status(200).json({ data: endereco });
    } catch (error: any) {
      console.error('Erro ao buscar o endereço:', error);
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
