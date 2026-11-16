import { useState } from 'react';
import { useCart } from "@/contexts/cartContext"; // Corrija o caminho conforme necessário
import axios from 'axios';
import { useUser } from '@clerk/clerk-react'; // Import para obter o usuário logado
import { useRouter } from 'next/router';
import EnderecoPopup from '@/components/endereco/EnderecoPopup';


// Defina o tipo para os itens do pedido
interface ItemPedido {
  id_produto: number;
  quantidade_item: number;
  valor_item: number;
}

export default function FinalizarPedido() {
  const { cart, clearCart } = useCart(); // Obtém os produtos do carrinho e a função para limpar o carrinho
  const { user } = useUser(); // Obtém o usuário logado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('C'); // Estado para armazenar a forma de pagamento selecionada
  const router = useRouter();
  const [pedidoFinalizado, setPedidoFinalizado] = useState<boolean>(false); // Controla exibição da mensagem de sucesso
  const [enderecoPopupOpen, setEnderecoPopupOpen] = useState(false); // Controla se o popup de endereço está aberto
  const [endereco, setEndereco] = useState(null); // Armazena o endereço preenchido

  const handleSaveEndereco = (endereco: any) => {
    setEndereco(endereco); // Armazena o endereço fornecido
    setEnderecoPopupOpen(false); // Fecha o popup após salvar o endereço
    handleFinalizarPedido(); // Chama a função para finalizar o pedido após salvar o endereço
  };
  
  const handleFinalizarPedido = async () => {
    setLoading(true);
    setError(null);

    try {
      // Coleta os dados do pedido
      const id_usuario_clerk = user?.id || ''; // Captura o ID do usuário logado
      const valor_pedido = cart.reduce((total, item) => total + (item.preco_produto * item.quantidade), 0);
      const situacao_pedido = 'A'; // Status inicial do pedido
      const itens: ItemPedido[] = cart.map(item => ({
        id_produto: item.id_produto,
        quantidade_item: item.quantidade,
        valor_item: item.preco_produto,
      }));

      // Envia o pedido para a API
      const response = await axios.post('/api/pedidos/pedidos', {
        id_usuario_clerk,
        formapagto_pedido: formaPagamento,
        valor_pedido,
        situacao_pedido,
        itens,
      });

      if (response.status === 201) {
        setPedidoFinalizado(true); // Exibe a notificação de sucesso
      }
    } catch (error) {
      console.error('Erro ao criar o pedido:', error);
      setError('Erro ao criar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const Finaliza = async () => {
    clearCart(); // Limpar o carrinho após a criação do pedido
    router.push(`/pedidos/meuspedidos`);
  }

  const abrirPopupEndereco = () => {
    setEnderecoPopupOpen(true); // Abre o popup de endereço ao clicar em "Finalizar Pedido"
  };

  return (
    <div className="relative mt-8">
      {/* Popup de endereço */}
      <EnderecoPopup 
        isOpen={enderecoPopupOpen} 
        onClose={() => setEnderecoPopupOpen(false)} 
        onSave={handleSaveEndereco} 
      />
      <div className="flex flex-col items-center justify-center absolute bottom-0 left-0 right-0 p-4">
        Seleção de forma de pagamento 
        <div className="mb-4 w-full max-w-xs">
          <label htmlFor="formaPagamento" className="block text-sm font-bold text-gray-1000">
            Forma de Pagamento
          </label>
          <select
            id="formaPagamento"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="B">Boleto Bancário</option>
            <option value="P">Pix</option>
          </select>
        </div>

        <button
          onClick={abrirPopupEndereco}
          disabled={loading}
          className="bg-green-500 text-white py-3 px-4 rounded-lg text-lg font-bold shadow-md hover:bg-green-600 transition-colors"
        >
          {loading ? 'Finalizando...' : 'Finalizar Pedido'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

          {/* Modal de Sucesso */}
          {pedidoFinalizado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Sucesso!</h2>
              <p className="text-lg mb-6">Seu pedido foi finalizado com sucesso.</p>
              <button
                onClick={() => Finaliza()}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
