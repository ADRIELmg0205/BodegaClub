import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router'; // Importando useRouter
import Header from '@/components/header/Header';
import Footer from "@/components/footer/Footer";

interface Pedido {
  id_pedido: number;
  valor_pedido: number;
  situacao_pedido: string;
  formapagto_pedido: string;
  data_pedido: string;
  usuario: {
    clerk_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  itens?: ItemPedido[];
}

interface ItemPedido {
  id_item: number;
  id_produto: number;
  quantidade_item: number;
  valor_item: number;
  valortotal_item: number;
  produto?: Produto;
}

interface Produto {
  nome_produto: string;
}

// Função para mapear o status para sua descrição
const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'A':
      return 'Aguardando Pagamento';
    case 'S':
      return 'Separação';
    case 'E':
      return 'Enviado';
    case 'R':
      return 'Recebido';
    case 'C':
      return 'Cancelado';
    default:
      return 'Status desconhecido';
  }
};

// Função para mapear a forma de pagamento para sua descrição
const getPagamentoDescription = (pagamento: string): string => {
  switch (pagamento) {
    case 'P':
      return 'Pix';
    case 'B':
      return 'Boleto';
    case 'C':
      return 'Boleto';
    default:
      return 'Forma de pagamento desconhecida';
  }
};

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);
  const { userId } = useAuth();
  const router = useRouter(); // Inicializando o useRouter

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/pedidos/meuspedidos', {
          params: { id_usuario_clerk: userId }
        });

        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setError('Erro ao carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPedidos();
    }
  }, [userId]);

  const toggleExpandPedido = (idPedido: number) => {
    setExpandedPedido(expandedPedido === idPedido ? null : idPedido);
  };

  const GeraPix = async (pedido: Pedido) => {
    try {
      const { data } = await axios.post('/api/pagamentos/CriarPagtoMP_Pix', {
        transaction_amount: pedido.valor_pedido,
        description: `Pedido #${pedido.id_pedido} - ${pedido.usuario.first_name} ${pedido.usuario.last_name} (${pedido.usuario.email})`,
        email: pedido.usuario.email
      });

      const paymentUrl = data.ticketUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        console.error("URL de pagamento não recebida:", data);
        setError("Erro ao obter a URL de pagamento.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setError("Erro ao processar pagamento.");
    }
  };

  const GeraBoleto = (pedido: Pedido) => {// Extraia os valores do pedido
    const dataDocumento = new Date(pedido.data_pedido);
  
    // Adicionar 30 dias à data do documento para gerar a data de vencimento
    const dataVencimento = new Date(dataDocumento);
    dataVencimento.setDate(dataVencimento.getDate() + 30);

    router.push({
      pathname: '/pagamentos/Boleto',
      query: {
        sacado: pedido.usuario.first_name + ' ' + pedido.usuario.last_name,
        endereco: 'Rua 1, perto da rua 2',
        cpf: '000.000.000-00',
        valorDocumento: pedido.valor_pedido,
        dataDocumento: dataDocumento.toLocaleDateString('pt-BR'), // Formatar a data do documento
        dataVencimento: dataVencimento.toLocaleDateString('pt-BR'), // Formatar a data de vencimento
        descricao: `Pedido #${pedido.id_pedido} - ${pedido.usuario.first_name} ${pedido.usuario.last_name} (${pedido.usuario.email})`,
      },
    });
  };

  const CriaPagto = (pedido: Pedido) => {// Extraia os valores do pedido
     if (pedido.formapagto_pedido == 'P') {
      GeraPix(pedido) 
     } else {
      GeraBoleto(pedido)
     }

  };

  return (
    <>
      <Header />

      <div className="container mx-auto mt-8 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Meus Pedidos</h1>

        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div 
                key={pedido.id_pedido} 
                className="bg-white border border-gray-300 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Pedido #{pedido.id_pedido}</h2>
                  <p className="text-lg font-semibold text-green-600">R$ {pedido.valor_pedido.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600"><strong>Forma de Pagamento:</strong> {getPagamentoDescription(pedido.formapagto_pedido)}</p>
                  <p className="text-gray-600"><strong>Situação:</strong> {getStatusDescription(pedido.situacao_pedido)}</p>
                  <p className="text-gray-600"><strong>Data do Pedido:</strong> {new Date(pedido.data_pedido).toLocaleDateString()}</p>
                </div>

                <button
                  className="mt-4 flex items-center text-blue-500 focus:outline-none"
                  onClick={() => toggleExpandPedido(pedido.id_pedido)}
                >
                  {expandedPedido === pedido.id_pedido ? 'Esconder Itens' : 'Ver Itens'}
                </button>

                {expandedPedido === pedido.id_pedido && pedido.itens && pedido.itens.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {pedido.itens.map((item) => (
                      <div key={item.id_item} className="p-2 bg-gray-100 rounded">
                        <p className="text-gray-700"><strong>Produto:</strong> {item.produto?.nome_produto || 'Nome do produto não disponível'}</p>
                        <p className="text-gray-700"><strong>Quantidade:</strong> {item.quantidade_item}</p>
                        <p className="text-gray-700"><strong>Valor Unitário:</strong> R$ {item.valor_item.toFixed(2)}</p>
                        <p className="text-gray-700"><strong>Valor Total:</strong> R$ {item.valortotal_item.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exibir botão de pagamento apenas se o status for "Aguardando Pagamento" */}
                {pedido.situacao_pedido === 'A' && (
                  <div className="flex flex-col ">
                    <button
                      className="mt-4 bg-blue-600 text-white w-40 px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => CriaPagto(pedido)}
                    >
                      Pagar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
