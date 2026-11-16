import { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Criar o pagamento e retornar a URL de pagamento
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { transaction_amount, description, email } = req.body;

    // Validação básica dos parâmetros
    if (typeof transaction_amount !== 'number' || transaction_amount <= 0) {
        return res.status(400).json({ error: 'O valor da transação deve ser um número positivo.' });
    }

    if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: 'A descrição deve ser uma string não vazia.' });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'O e-mail fornecido é inválido.' });
    }

    const body = {
        transaction_amount,
        description,
        payment_method_id: 'pix',
        payer: {
            email,
        },
    };

    try {
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
            console.error('MERCADOPAGO_ACCESS_TOKEN não está configurado.');
            return res.status(500).json({ error: 'Configuração do pagamento indisponível.' });
        }

        const client = new MercadoPagoConfig({
            accessToken,
            options: {
                timeout: 5000
            }
        });
        const payment = new Payment(client);
        const response = await payment.create({ body });
        console.log(response); // Log da resposta
        
        // Verificar se a URL de pagamento está disponível
        const ticketUrl = response.point_of_interaction?.transaction_data?.ticket_url;
        if (ticketUrl) {
            // Retornar a URL de pagamento para o cliente
            res.status(200).json({ ticketUrl });
        } else {
            console.error('URL de pagamento não disponível:', response);
            res.status(400).json({ error: 'URL de pagamento não disponível' });
        }
    } catch (error) {
        console.error('Erro ao criar o pagamento:', error);
        res.status(500).json({ error: 'Erro ao criar o pagamento' });
    }
}
