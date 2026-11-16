import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import ProtectPage from "@/components/login/ProtectPage";
import EnderecoPopup from '@/components/endereco/EnderecoPopup';
import LoadingImage from '@/components/common/LoadingImage';

const FinalizarPedidoPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plano, setPlano] = useState<any>(null);
  const [planLoadError, setPlanLoadError] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [tipoPlano, setTipoPlano] = useState<'mensal' | 'semestral' | 'anual'>('mensal');
  const [pedidoFinalizado, setPedidoFinalizado] = useState<boolean>(false); // Controla exibição da mensagem de sucesso
  const [confirmacaoModalAberta, setConfirmacaoModalAberta] = useState<boolean>(false); // Controla exibição da modal de confirmação
  const { userId } = useAuth();
  const [enderecoPopupOpen, setEnderecoPopupOpen] = useState(false); // Controla se o popup de endereço está aberto
  const [endereco, setEndereco] = useState(null); // Armazena o endereço preenchido

  const handleSaveEndereco = (endereco: any) => {
    setEndereco(endereco); // Armazena o endereço fornecido
    setEnderecoPopupOpen(false); // Fecha o popup após salvar o endereço
    abrirModalConfirmacao(); // Chama a função para finalizar o pedido após salvar o endereço
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setPlano(null);
    setPlanLoadError(false);
    const fetchPlano = async () => {
      try {
        const response = await fetch(`/api/clube/planos/${id}`);
        if (!response.ok) throw new Error(`Falha ao carregar o plano: ${response.status}`);
        const planoData = await response.json();
        if (!cancelled) setPlano(planoData);
      } catch (error) {
        if (!cancelled) {
          console.error('Erro ao buscar plano de assinatura:', error);
          setPlanLoadError(true);
        }
      }
    };
    fetchPlano();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleFormaPagamentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormaPagamento(event.target.value);
  };

  const handleTipoPlanoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoPlano(event.target.value as 'mensal' | 'semestral' | 'anual');
  };

  const abrirModalConfirmacao = () => {
    //if (!formaPagamento) {
    //  alert('Por favor, selecione uma forma de pagamento');
    //  return;
    //}
    setConfirmacaoModalAberta(true); // Exibe a modal de confirmação
  };

  const finalizarPedido = async () => {
    if (!userId) {
      console.error('Usuário não está logado');
      return;
    }

    const valoresPlano = {
      mensal: plano.precomensal_plano,
      semestral: plano.precosemestral_plano,
      anual: plano.precoanual_plano,
    };

    try {
      const assinaturaData = {
        id_plano: plano.id_plano,
        valor_assinatura: valoresPlano[tipoPlano],
        mensalidade_assinatura: valoresPlano[tipoPlano],
        situacao_assinatura: 'A',
        formaplano_assinatura: tipoPlano[0].toUpperCase(),
        proximopagto_assinatura: new Date().toISOString(),
        formapagto_assinatura: 'B',//formaPagamento[0].toUpperCase(),
        id_usuario_clerk: userId,
        data_assinatura: new Date().toISOString(),
      };

      const response = await fetch('/api/clube/PostAssinatura/PostAssinatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assinaturaData),
      });

      if (response.ok) {
        setConfirmacaoModalAberta(false); // Fecha a modal de confirmação
        setPedidoFinalizado(true); // Exibe a mensagem de sucesso
      } else {
        const errorData = await response.json();
        alert('Erro ao finalizar o pedido.');
      }
    } catch (error) {
      alert('Ocorreu um erro ao finalizar o pedido.');
    }
  };

  if (!plano) {
    return (
      <main>
        <Header />
        <div className="container mx-auto min-h-[60vh] px-4 py-8">
          {planLoadError ? (
            <p className="py-16 text-center text-gray-600">Não foi possível carregar o plano. Tente novamente.</p>
          ) : (
            <div className="mx-auto w-full animate-pulse rounded-lg bg-gray-100 p-6 shadow-md md:w-3/4 lg:w-2/3">
              <div className="mb-6 h-64 rounded bg-gray-200" />
              <div className="mb-4 h-8 w-1/2 rounded bg-gray-200" />
              <div className="mb-6 h-6 w-1/3 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
            </div>
          )}
        </div>
      </main>
    );
  }

  const valorPlanoSelecionado = {
    mensal: plano.precomensal_plano,
    semestral: plano.precosemestral_plano,
    anual: plano.precoanual_plano,
  }[tipoPlano];

  const abrirPopupEndereco = () => {
    setEnderecoPopupOpen(true); // Abre o popup de endereço ao clicar em "Finalizar Pedido"
  };

  return (
    <main>
      <ProtectPage>
      <Header />
      <div className="relative mt-8">
      {/* Popup de endereço */}
      <EnderecoPopup 
        isOpen={enderecoPopupOpen} 
        onClose={() => setEnderecoPopupOpen(false)} 
        onSave={handleSaveEndereco} 
      ></EnderecoPopup></div>
      
      <div className="container mx-auto py-8 px-4 flex flex-col items-center">
        <div className="w-full md:w-3/4 lg:w-2/3 bg-white shadow-md rounded-lg p-6">
          <div className="w-full h-64 relative mb-6">
            <LoadingImage
              src={plano.imagem_plano}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              priority
              alt={plano.nome_plano}
              className="rounded-t-lg object-cover"
              containerClassName="h-full w-full"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">Resumo do Pedido</h1>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{plano.nome_plano}</h2>
            {/* Exibir o valor do plano conforme o tipo de plano selecionado */}
            <p className="text-xl font-semibold mb-4">R${valorPlanoSelecionado.toFixed(2)}/mês</p>
          </div>

          {/* Seleção de Tipo de Plano */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Selecione o Tipo de Plano:</h3>
            <div className="flex flex-col space-y-2">
              <label>
                <input
                  type="radio"
                  value="mensal"
                  checked={tipoPlano === 'mensal'}
                  onChange={handleTipoPlanoChange}
                  className="mr-2"
                />
                Mensal - R${plano.precomensal_plano.toFixed(2)}
              </label>
              <label>
                <input
                  type="radio"
                  value="semestral"
                  checked={tipoPlano === 'semestral'}
                  onChange={handleTipoPlanoChange}
                  className="mr-2"
                />
                Semestral - R${plano.precosemestral_plano.toFixed(2)}
              </label>
              <label>
                <input
                  type="radio"
                  value="anual"
                  checked={tipoPlano === 'anual'}
                  onChange={handleTipoPlanoChange}
                  className="mr-2"
                />
                Anual - R${plano.precoanual_plano.toFixed(2)}
              </label>
            </div>
          </div>

          {/* Formas de Pagamento 
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Escolha a Forma de Pagamento:</h3>
            <div className="flex flex-col space-y-2">
              {/*<label>
                <input
                  type="radio"
                  value="cartao"
                  checked={formaPagamento === 'cartao'}
                  onChange={handleFormaPagamentoChange}
                  className="mr-2"
                />
                Cartão de Crédito
              </label>
              <label>
                <input
                  type="radio"
                  value="boleto"
                  checked={formaPagamento === 'boleto'}
                  onChange={handleFormaPagamentoChange}
                  className="mr-2"
                />
                Boleto Bancário
              </label>
              <label>
                <input
                  type="radio"
                  value="pix"
                  checked={formaPagamento === 'pix'}
                  onChange={handleFormaPagamentoChange}
                  className="mr-2"
                />
                Pix
              </label>
            </div>
          </div>*/}

          {/* Botão de Finalizar Pedido */}
          <button
            onClick={abrirPopupEndereco}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Finalizar Pedido
          </button>
        </div>

        {/* Modal de Confirmação */}
        {confirmacaoModalAberta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Confirmação</h2>
              <p className="text-lg mb-6">Tem certeza que deseja finalizar o pedido?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={finalizarPedido}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmacaoModalAberta(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sucesso */}
        {pedidoFinalizado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Sucesso!</h2>
              <p className="text-lg mb-6">Seu pedido foi finalizado com sucesso.</p>
              <button
                onClick={() => router.push('/clube/minhasassinaturas/meus-pedidos')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
        
      </div>
      <Footer />
      </ProtectPage>
    </main>
  );
};

export default FinalizarPedidoPage;
