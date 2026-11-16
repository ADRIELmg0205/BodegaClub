import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoadingImage from '@/components/common/LoadingImage';

interface PlanoAssinatura {
  id_plano: number;
  nome_plano: string;
  descricao_plano: string;
  imagem_plano: string;
  precomensal_plano: number;
}

interface Props {
  searchTerm: string;
  category: string;
}

export default function PlanosAssinatura({ searchTerm, category }: Props) {
  const [planos, setPlanos] = useState<PlanoAssinatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await axios.get('/api/clube/planos');
        setPlanos(response.data);
      } catch (error) {
        console.error('Erro ao buscar planos de assinatura:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const handlePlanoClick = (id: number) => {
    router.push(`/clube/plano/${id}`);
  };

  const filteredPlanos = planos.filter(plano =>
    (plano.nome_plano.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.descricao_plano.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (category === 'todos' || plano.descricao_plano.toLowerCase().includes(category.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-screen-xl mx-auto">
      {isLoading && Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="h-[600px] w-[320px] animate-pulse rounded-lg bg-gray-200" />
      ))}
      {filteredPlanos.map((plano, index) => (
        <div 
          key={plano.id_plano} 
          className="flex flex-col items-center rounded-lg shadow-xl border border-zinc-300 overflow-hidden bg-white transition-transform duration-300 transform hover:scale-105 cursor-pointer w-[320px] h-[600px]"
          onClick={() => handlePlanoClick(plano.id_plano)}
        >
          {/* Imagem ocupando a parte superior toda */}
          <div className="w-full h-[300px] relative">
            <LoadingImage
              src={plano.imagem_plano}
              fill
              sizes="(max-width: 768px) 320px, 320px"
              priority={index === 0}
              alt={plano.nome_plano}
              className="object-cover"
              containerClassName="h-full w-full"
            />
          </div>
          {/* Nome do plano logo abaixo da imagem */}
          <h2 className="text-3xl text-center font-bold mt-10 text-blue-600">{plano.nome_plano}</h2>
          
          {/* Preço mensal */}
          <div className="text-center p-5 text-2xl font-semibold text-gray-700">
            <p>R$ {plano.precomensal_plano}/mês</p>
          </div>

          {/* Botão de assinatura */}
          <button className="bg-blue-600 hover:bg-green-600 text-white text-xl font-bold rounded-lg mt-auto w-full px-6 py-4">
            Saiba Mais
          </button>
        </div>
      ))}
    </div>
  );
}
