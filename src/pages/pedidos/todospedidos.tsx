import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import ProtectPageAdmin from "@/components/login/ProtectPageAdmin";

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
    email : string;
  };
  itens: {
    id_item: number;
    id_produto: number;
    quantidade_item: number;
    valor_item: number;
    produto: {
      nome_produto: string;
    };
  }[];
}

const formaPagamentoLegenda: Record<string, string> = {
  P: 'P- Pix',
  B: 'B- Boleto',
  C: 'B- Boleto'
};

const situacaoPedidoLegenda: Record<string, string> = {
  A: 'A- Aguardando envio',
  S: 'S- Separação',
  E: 'E- Enviado',
  R: 'R- Recebido',
  C: 'C- Cancelado'
};

const situacaoOptions: Record<string, string> = {
  A: 'Aguardando envio',
  S: 'Separação',
  E: 'Enviado',
  R: 'Recebido',
  C: 'Cancelado'
};

export default function TodosPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [endereco, setEndereco] = useState<any>(null); // Estado para armazenar o endereço
  const [showPopup, setShowPopup] = useState(false); // Estado para controle do popup

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('/api/pedidos/todospedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setError('Erro ao buscar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const updatePedidoSituacao = async (id: number, situacao: string) => {
    try {
      const response = await axios.put(`/api/pedidos/${id}`, { situacao_pedido: situacao });
      console.log('Pedido atualizado com sucesso:', response.data);
      await fetchPedidos();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  // Função para abrir o endereço
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredPedidos = pedidos.filter(pedido =>
    `${pedido.usuario.first_name} ${pedido.usuario.last_name} ${pedido.usuario.email} ${pedido.id_pedido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ProtectPageAdmin>
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Todos os Pedidos</h1>

        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Pesquisa por Cliente
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome do cliente"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma de Pagamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPedidos.map(pedido => (
              <tr key={pedido.id_pedido}>
                <td className="px-6 py-4 whitespace-nowrap">{pedido.id_pedido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pedido.usuario.first_name} {pedido.usuario.last_name} ({pedido.usuario.email})</td>
                <td className="px-6 py-4 whitespace-nowrap">{formaPagamentoLegenda[pedido.formapagto_pedido] || 'Desconhecida'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pedido.valor_pedido.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={pedido.situacao_pedido}
                    onChange={(e) => updatePedidoSituacao(pedido.id_pedido, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    {Object.entries(situacaoOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(pedido.data_pedido).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pedido.itens.map(item => (
                    <div key={item.id_item}>
                      {item.quantidade_item} x {item.produto.nome_produto} ({item.valor_item.toFixed(2)})
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => abrirEndereco(pedido.usuario.clerk_user_id)}
                    className="text-blue-500 hover:underline"
                  >
                    Ver Endereço
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
      </main>
      <Footer />
      </ProtectPageAdmin>
    </div>
  );
}
