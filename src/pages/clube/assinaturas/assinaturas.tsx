import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import axios from 'axios';
import ProtectPage from "@/components/login/ProtectPage";
import ProtectPageAdmin from "@/components/login/ProtectPageAdmin";

interface Pedido {
  id_assinatura: number; 
  id_plano: number;
  nome_plano: string;
  valor_assinatura: number;
  mensalidade_assinatura: number;
  situacao_assinatura: string;
  formapagto_assinatura: string;
  data_assinatura: string;
  id_usuario_clerk: string;
  nome_usuario: string; // Novo campo para o nome do usuário
  sobrenome_usuario: string; // Novo campo para o sobrenome do usuário
  gostos: string;
}

const MeusPedidosPage = () => {
  const { userId } = useAuth(); 
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]); // Estado para pedidos filtrados
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para a barra de pesquisa
  const [endereco, setEndereco] = useState<any>(null); // Estado para armazenar o endereço
  const [showPopup, setShowPopup] = useState(false); // Estado para controle do popup
  const [selectedGostos, setSelectedGostos] = useState<string | null>(null); // Estado para o gostos selecionado


  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (userId) {
          const response = await axios.get(`/api/clube/assinaturas/assinaturas`, {
            params: { id_usuario_clerk: 'todos' },
          });
          const pedidosComPlano = response.data.map((pedido: any) => {
            const nomePlano = pedido.plano_assinatura?.nome_plano || 'Plano desconhecido'; 
            const primeiroNome = pedido.users?.first_name || '';
            const sobrenome = pedido.users?.last_name || '';
            const g = pedido.users?.gostos || '';
            return {
              ...pedido,
              nome_plano: nomePlano,
              nome_usuario: primeiroNome || 'Desconhecido',
              sobrenome_usuario: sobrenome || 'Desconhecido',
              gostos: g || ''
            };
          });
          setPedidos(pedidosComPlano);
          setFilteredPedidos(pedidosComPlano); // Inicializa os pedidos filtrados
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

  useEffect(() => {
    // Filtro de pedidos com base no termo de pesquisa
    const resultadosFiltrados = pedidos.filter(pedido =>
      `${pedido.nome_usuario} ${pedido.sobrenome_usuario}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPedidos(resultadosFiltrados);
  }, [searchTerm, pedidos]);

  const cancelarAssinatura = async (id_assinatura: number) => { 
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

  const abrirEndereco = async (idUsuarioClerk: string) => {
    try {
      const response = await axios.get(`/api/endereco/Endereco?id_usuario_clerk=${idUsuarioClerk}`);
      setEndereco(response.data.data); // Armazena o endereço no estado
      setShowPopup(true); // Abre o popup
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Fecha o popup
    setEndereco(null); // Limpa o endereço
  };

  const exibirGostos = (gostos: string) => {
    setSelectedGostos(gostos);  // Exibe o gostos no estado
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
      <ProtectPageAdmin>
        <Header />
        <div className="container mx-auto py-8 px-4 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Assinaturas</h1>

          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Pesquisar por nome do cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

          {filteredPedidos.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Nome do Cliente</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Nome do Plano</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Preço</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Data da Assinatura</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Situação</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Ações</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Endereço</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-600">Gostos</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id_assinatura} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="py-3 px-4 border-b text-gray-800">
                      {pedido.nome_usuario} {pedido.sobrenome_usuario}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">{pedido.nome_plano || 'N/A'}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{pedido.valor_assinatura || 'N/A'}</td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(pedido.data_assinatura).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          pedido.situacao_assinatura === 'A' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {pedido.situacao_assinatura === 'A' ? 'Aberta' : pedido.situacao_assinatura === 'C' ? 'Cancelado' : pedido.situacao_assinatura}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      {pedido.situacao_assinatura === 'A' && (
                        <button
                          onClick={() => cancelarAssinatura(pedido.id_assinatura)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                          Cancelar Assinatura
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b">
                        <button
                          onClick={() => abrirEndereco(pedido.id_usuario_clerk)}
                          className="bg-blue-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                          Abrir Endereço
                        </button>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => exibirGostos(pedido.gostos)}
                        disabled={!pedido.gostos} // Desativa o botão se não houver gostos
                        className={`py-2 px-4 rounded-lg ${
                          pedido.gostos
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        Ver Gostos Completos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
        {/* Popup para exibir o endereço */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Endereço do Usuário</h2>
              {endereco ? (
                <div>
                  <p><strong>Rua:</strong> {endereco.rua_endereco}, {endereco.numero_endereco}</p>
                  <p><strong>Bairro:</strong> {endereco.bairro_endereco}</p>
                  <p><strong>Cidade:</strong> {endereco.cidade_endereco}</p>
                  <p><strong>Estado:</strong> {endereco.estado_endereco}</p>
                  <p><strong>CEP:</strong> {endereco.cep_endereco}</p>
                  {endereco.complemento_endereco && <p><strong>Complemento:</strong> {endereco.complemento_endereco}</p>}
                </div>
              ) : (
                <p>Carregando endereço...</p>
              )}
              <button onClick={closePopup} className="mt-4 text-red-500 hover:underline">Fechar</button>
            </div>
          </div>
        )}

        {selectedGostos && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-xxl w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-x mb-1 font-bold">Gostos Completos</h2>
              <pre className="whitespace-pre-wrap break-words">
                {selectedGostos}
              </pre>
              <button
                onClick={() => setSelectedGostos(null)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
            </table>
            
          ) : (
            <p className="text-center text-gray-700">Nenhum pedido encontrado.</p>
          )}
        </div>
        <Footer />
      </ProtectPageAdmin>
    </main>
  );
};

export default MeusPedidosPage;
