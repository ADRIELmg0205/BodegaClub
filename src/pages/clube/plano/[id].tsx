import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BottomHeader from '@/components/header/BottomHeader';
import LoadingImage from '@/components/common/LoadingImage';

interface PlanoAssinatura {
  id_plano: number;
  nome_plano: string;
  descricao_plano: string;
  imagem_plano: string;
  precomensal_plano: number;
  precosemestral_plano: number;
  precoanual_plano: number;
}

const PlanoAssinaturaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plano, setPlano] = useState<PlanoAssinatura | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setPlano(null);
    setLoadError(false);
    const fetchPlano = async () => {
      try {
        const response = await axios.get(`/api/clube/planos/${id}`);
        if (!cancelled) setPlano(response.data);
      } catch (error) {
        if (!cancelled) {
          console.error('Erro ao buscar plano de assinatura:', error);
          setLoadError(true);
        }
      }
    };
    fetchPlano();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!plano) {
    return (
      <main>
        <Header />
        <div className="container mx-auto min-h-[60vh] px-4 py-8">
          {loadError ? (
            <p className="py-16 text-center text-gray-600">Não foi possível carregar este plano. Tente novamente.</p>
          ) : (
            <div className="mx-auto w-full max-w-4xl animate-pulse space-y-6">
              <div className="h-64 rounded-lg bg-gray-200 md:h-96" />
              <div className="h-8 w-1/2 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
            </div>
          )}
        </div>
      </main>
    );
  }

  const goToFinalizarPedido = (planoId: number) => {
    router.push(`/clube/finalizapedido/${plano.id_plano}`);
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto py-8 px-4 flex flex-col items-center">
        {/* Imagem do Plano */}
        <div className="w-full max-w-4xl mx-auto relative h-64 md:h-96">
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

        <div className="mt-12 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4">{plano.nome_plano}</h2>
          <p className="text-gray-600">{plano.descricao_plano}</p>
        </div>

        {/* Cards de Planos */}
        <div className="mt-12 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold mb-8">Escolha seu Plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Mensal */}
            <div className="bg-white border border-gray-400 shadow-md p-6 rounded-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-4">Plano Mensal</h3>
              <p className="text-3xl font-semibold mb-4">R${plano.precomensal_plano.toFixed(2)} /mês</p>
            </div>

            {/* Plano Semestral */}
            <div className="bg-white border border-gray-400 shadow-md p-6 rounded-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-4">Plano Semestral</h3>
              <p className="text-3xl font-semibold mb-4">R${plano.precosemestral_plano.toFixed(2)} /6 meses</p>
            </div>

            {/* Plano Anual */}
            <div className="bg-white border border-gray-400 shadow-md p-6 rounded-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-4">Plano Anual</h3>
              <p className="text-3xl font-semibold mb-4">R${plano.precoanual_plano.toFixed(2)} /ano</p>
            </div>
          </div>
        </div>

        {/* Botão único de Assinar */}
        <div className="mt-8">
          <button
            onClick={() => goToFinalizarPedido(plano.id_plano)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors">
            Assinar Agora
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PlanoAssinaturaPage;
