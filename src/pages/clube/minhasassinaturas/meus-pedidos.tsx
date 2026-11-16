import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import axios from 'axios';
import ProtectPage from "@/components/login/ProtectPage";
import { useRouter } from 'next/router';

interface Pedido {
  id_assinatura: number;
  id_plano: number;
  nome_plano: string;
  valor_assinatura: number;
  mensalidade_assinatura: number;
  situacao_assinatura: string;
  formapagto_assinatura: string;
  data_assinatura: string;
  usuario: {
    clerk_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const MeusPedidosPage = () => {
  const { userId } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<'boleto' | 'pix'>('boleto'); // Estado para o tipo de pagamento

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (userId) {
          const response = await axios.get(`/api/clube/MinhasAssinaturas/assinaturas`, {
            params: { id_usuario_clerk: userId },
          });
          const pedidosComPlano = response.data.map((pedido: any) => {
            const nomePlano = pedido.plano_assinatura?.nome_plano || 'Plano desconhecido';
            return {
              ...pedido,
              nome_plano: nomePlano,
            };
          });
          setPedidos(pedidosComPlano);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setError('Erro ao buscar pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [userId]);

  const cancelarAssinatura = async (id_assinatura: number) => {
    // Adicionar mensagem de confirmação
    const confirmCancel = window.confirm(
      "Tem certeza que deseja cancelar o plano de assinatura?"
    );
    if (!confirmCancel) return; // Se o usuário cancelar, não continua

    try {
      const response = await axios.put(`/api/clube/MinhasAssinaturas/cancelarAssinatura`, {
        id_assinatura,
      });
      if (response.status === 200) {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id_assinatura === id_assinatura
              ? { ...pedido, situacao_assinatura: 'C' }
              : pedido
          )
        );
      }
    } catch (error) {
      console.error('Erro ao cancelar a assinatura:', error);
      setError('Erro ao cancelar a assinatura');
    }
  };

  const GeraPix = async (pedido: Pedido) => {
    try {
      const { data } = await axios.post('/api/pagamentos/CriarPagtoMP_Pix', {
        transaction_amount: pedido.valor_assinatura,
        description: `Assinatura #${pedido.id_assinatura} - ${pedido.usuario.first_name} ${pedido.usuario.last_name}`,
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
    const dataDocumento = new Date(pedido.data_assinatura);
  
    // Adicionar 30 dias à data do documento para gerar a data de vencimento
    const dataVencimento = new Date(dataDocumento);
    dataVencimento.setDate(dataVencimento.getDate() + 30);

    router.push({
      pathname: '/pagamentos/Boleto',
      query: {
        sacado: pedido.usuario.first_name + ' ' + pedido.usuario.last_name,
        endereco: 'Rua 1, perto da rua 2',
        cpf: '000.000.000-00',
        valorDocumento: pedido.valor_assinatura,
        dataDocumento: dataDocumento.toLocaleDateString('pt-BR'), // Formatar a data do documento
        dataVencimento: dataVencimento.toLocaleDateString('pt-BR'), // Formatar a data de vencimento
        descricao: `Assinatura #${pedido.id_assinatura} - ${pedido.usuario.first_name} ${pedido.usuario.last_name}`,
      },
    });
  };

  const handlePagamento = (pedido: Pedido) => {
    if (pagamentoSelecionado === 'pix') {
      GeraPix(pedido);
    } else {
      GeraBoleto(pedido);
    }
  };

  if (loading) {
    return (
      <main>
        <Header />
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="w-full h-64 relative mb-6 mx-auto">
            <div className="border-4 border-blue-500 border-t-transparent border-t-4 rounded-full w-16 h-16 mx-auto animate-spin"></div>
            <p className="mt-4 text-lg text-gray-700">Carregando seus pedidos...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Header />
        <div className="container mx-auto py-8 px-4 text-center">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ProtectPage>
        <Header />
        <div className="container mx-auto py-8 px-4 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Minhas Assinaturas</h1>
          {pedidos.length > 0 ? (
            <div className="space-y-6"> {/* Espaçamento entre os cards */}
              {pedidos.map((pedido) => (
                <div key={pedido.id_assinatura} className="bg-white border rounded-lg shadow-lg p-4 w-full"> {/* Card ocupa toda a largura */}
                  <h2 className="text-xl font-semibold mb-2">{pedido.nome_plano || 'Plano desconhecido'}</h2>
                  <p className="text-gray-700 mb-1">Preço: R$ {pedido.valor_assinatura || 'N/A'}</p>
                  <p className="text-gray-700 mb-1">
                    Data da Assinatura: {new Date(pedido.data_assinatura).toLocaleDateString()}
                  </p>
                  <p className="mb-4 text-gray-700">
                    Situação: 
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-sm ${
                        pedido.situacao_assinatura === 'A'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {pedido.situacao_assinatura === 'A' ? 'Aberta' : 'Cancelado'}
                    </span>
                  </p>

                    {pedido.situacao_assinatura === 'A' && (
                    <>
                      <div className="text-gray-700 mb-1">
                        <label className="mr-4 font-bold">Forma de Pagamento:</label>
                        <br></br>
                        <label className="mr-2">
                          <input
                            type="radio"
                            name="pagamento"
                            value="boleto"
                            checked={pagamentoSelecionado === 'boleto'}
                            onChange={() => setPagamentoSelecionado('boleto')}
                          />
                          Boleto
                        </label>
                        <br></br>
                        <label>
                          <input
                            type="radio"
                            name="pagamento"
                            value="pix"
                            checked={pagamentoSelecionado === 'pix'}
                            onChange={() => setPagamentoSelecionado('pix')}
                          />
                          Pix
                        </label>
                      </div>
                      <br></br>
                      <button
                        onClick={() => handlePagamento(pedido)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 w-48"
                      >
                        Realizar Pagamento
                      </button>
                    </>
                  )}

                  
                  {pedido.situacao_assinatura === 'A' && (
                    <div>
                    <button
                      onClick={() => cancelarAssinatura(pedido.id_assinatura)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 w-48 "
                    >
                      Cancelar Assinatura
                    </button>
                    </div>)}  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700">Você ainda não tem pedidos.</p>
          )}
        </div>
        <Footer />
      </ProtectPage>
    </main>
  );
};

export default MeusPedidosPage;
