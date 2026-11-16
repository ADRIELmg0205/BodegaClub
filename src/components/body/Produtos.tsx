import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCart } from "@/contexts/cartContext";
import LoadingImage from '@/components/common/LoadingImage';

interface Produto {
  id_produto: number;
  nome_produto: string;
  preco_produto: number;
  descricao_produto: string;
  tipo_produto: string;
  imagem_produto: string;
  principal_produto: string;
}

interface Props {
  searchTerm: string;
  category: string;
}

export default function Produtos({ searchTerm, category }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (produto: Produto) => {
    const produtoComQuantidade = { ...produto, quantidade: 1 };
    addToCart(produtoComQuantidade);
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('/api/produtos', { params: { view: 'listing' } });
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`);
  };

  const filteredProdutos = produtos.filter(produto =>
    (produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao_produto.toLowerCase().includes(searchTerm.toLowerCase())) &&
    ((category === 'todos') || (produto.tipo_produto.toLowerCase().includes(category.toLowerCase()) ||
      produto.descricao_produto.toLowerCase().includes(category.toLowerCase())))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {isLoading && Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-80 w-56 animate-pulse rounded-md border border-gray-200 bg-gray-100" />
      ))}
      {filteredProdutos.map((produto, index) => (
        <div
          key={produto.id_produto}
          className="flex flex-col items-center rounded-md border border-zinc-500 h-80 w-56 overflow-hidden transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => handleProductClick(produto.id_produto)}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-lg text-center font-semibold p-4">{produto.nome_produto}</h2>
            <LoadingImage
              src={produto.imagem_produto}
              height={120}
              width={120}
              alt={produto.nome_produto}
              sizes="120px"
              priority={index < 4}
              className="object-contain"
            />
            <span className="flex justify-between text-center p-6" style={{ fontSize: '18px' }} >R${produto.preco_produto.toFixed(2)}</span>
          </div>
          <button
            className="bg-blue-500 hover:bg-green-500 border-none text-white text-base font-bold rounded-md mt-auto w-full px-4 py-2">Comprar</button>
        </div>
      ))}
    </div>
  );
}
