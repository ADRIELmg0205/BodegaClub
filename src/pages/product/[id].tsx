import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import Header from "@/components/header/Header";
import Link from 'next/link';
import Footer from "@/components/footer/Footer";
import ProtectButton from "@/components/login/ProtectButton";
import { useCart } from "@/contexts/cartContext"; 
import { useUser } from '@clerk/nextjs';
import BottomHeader from "@/components/header/BottomHeader";
import QuantityInput from '@/components/common/QuantityInput';

interface Produto {
  id_produto: number;
  nome_produto: string;
  preco_produto: number;
  descricao_produto: string;
  tipo_produto: string;
  imagem_produto: string;
}

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [suggestions, setSuggestions] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [isFavoritosLoading, setIsFavoritosLoading] = useState<boolean>(true);
  const [loadingFavorito, setLoadingFavorito] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false); // Controle do estado do favorito
  const [AdicionadoCarrinho, setAdicionadoCarrinho] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [productError, setProductError] = useState(false);

  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setProduto(null);
    setSuggestions([]);
    setIsImageLoaded(false);
    setProductError(false);

    const fetchProduto = async () => {
      try {
        const response = await axios.get(`/api/produtos/${id}`);
        const produtoData = response.data;
        if (cancelled) return;

        setProduto(produtoData);
        try {
          const suggestionsResponse = await axios.get('/api/produtos', {
            params: { tipo_produto: produtoData.tipo_produto, exclude: produtoData.id_produto },
          });
          if (!cancelled) setSuggestions(suggestionsResponse.data);
        } catch (error) {
          console.error('Erro ao buscar sugestões:', error);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Erro ao buscar produto:', error);
          setProductError(true);
        }
      }
    };

    fetchProduto();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || isSignedIn !== true) {
      setIsFavorited(false);
      setIsFavoritosLoading(false);
      return;
    }

    let cancelled = false;
    setIsFavoritosLoading(true);

    const checkIfFavorited = async () => {
      try {
        const response = await axios.get('/api/Favoritos/Favoritos');
        const favoritosIds = response.data.map((fav: { id_produto: number }) => fav.id_produto);
        if (!cancelled) setIsFavorited(favoritosIds.includes(Number(id)));
      } catch (error) {
        if (!cancelled) console.error('Erro ao buscar favoritos:', error);
      } finally {
        if (!cancelled) setIsFavoritosLoading(false);
      }
    };

    checkIfFavorited();
    return () => {
      cancelled = true;
    };
  }, [id, isSignedIn]);

  const incrementQuantity = () => {
    setQuantidade(prevQuantidade => prevQuantidade + 1);
  };

  const decrementQuantity = () => {
    if (quantidade > 1) {
      setQuantidade(prevQuantidade => prevQuantidade - 1);
    }
  };

  const handleAddToCart = () => {
    if (produto) {
      const itemToAdd = { ...produto, quantidade };
      setAdicionadoCarrinho(true);
      addToCart(itemToAdd);
      console.log(`Adicionando ${quantidade} unidades do produto ${produto.nome_produto} ao carrinho`);
    }
  };

  const AdicionadoComSucesso = () => {
    setAdicionadoCarrinho(false);
  };

  const handleBuyNow = () => {
    if (produto) {
      addToCart({ ...produto, quantidade });
      router.push("/carrinho/cart");
    }
  };

  const handleFavorite = async (produtoId: number) => {
    setLoadingFavorito(produtoId); // Inicia o carregamento para o produto específico
    try {
      if (isFavorited) {
        await axios.delete('/api/Favoritos/AdicionaRemove', { data: { produtoId } });
        setIsFavorited(false);
      } else {
        await axios.post('/api/Favoritos/AdicionaRemove', { produtoId });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
    } finally {
      setLoadingFavorito(null); // Finaliza o carregamento
    }
  };

  if (!produto) {
    return (
      <main>
        <Header />
        <div className="container mx-auto min-h-[60vh] px-4 py-8">
          {productError ? (
            <p className="py-16 text-center text-gray-600">Não foi possível carregar este produto. Tente novamente.</p>
          ) : (
            <div className="mx-auto flex w-full flex-col items-center gap-8 rounded-lg bg-white p-6 shadow-md md:w-3/4 md:flex-row lg:w-2/3">
              <div className="h-[300px] w-[300px] max-w-full animate-pulse rounded-md bg-gray-200" />
              <div className="w-full space-y-4 md:flex-1">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <BottomHeader setCategory={setSearchTerm} />
      <div className="container mx-auto py-8 px-4 flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md w-full md:w-3/4 lg:w-2/3">
            <div className="relative flex min-h-[300px] w-full items-center justify-center md:w-1/2">
              {!isImageLoaded && (
                <div className="absolute h-[300px] w-[300px] max-w-full animate-pulse rounded-md bg-gray-200" />
              )}
              <Image
              src={produto.imagem_produto}
              height={300}
              width={300}
              alt={produto.nome_produto}
              priority
              sizes="(max-width: 768px) 100vw, 300px"
              onLoad={() => setIsImageLoaded(true)}
              className={`rounded-md object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Botão de favoritos posicionado no canto superior direito da imagem */}
            {isSignedIn && (
              <button
                onClick={() => handleFavorite(produto.id_produto)}
                className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  isFavorited ? 'bg-red-300' : 'bg-gray-300'
                } ${loadingFavorito === produto.id_produto ? 'opacity-50' : ''}`}
                disabled={isFavoritosLoading || loadingFavorito === produto.id_produto}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            )}
          </div>
          <div className="md:w-1/2 md:ml-8 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold mb-4">{produto.nome_produto}</h1>
            <p className="text-xl font-semibold text-gray-700 mb-4">R${produto.preco_produto.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">Tipo: {produto.tipo_produto}</p>
            <div className="flex items-center mb-4">
              <button onClick={decrementQuantity} className="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-l">
                -
              </button>
              <QuantityInput
                value={quantidade}
                label="Quantidade do produto"
                onChange={setQuantidade}
                className="h-10"
              />
              <button onClick={incrementQuantity} className="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-r">
                +
              </button>
            </div>
            <div className="flex space-x-4">
              <ProtectButton onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Adicionar ao Carrinho
              </ProtectButton>
              <ProtectButton onClick={handleBuyNow} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Comprar Agora
              </ProtectButton>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Descrição do Produto</h2>
          <p className="text-gray-600">{produto.descricao_produto}</p>
        </div>

        <div className="mt-12 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Sugestões</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {suggestions.map(suggestion => (
              <Link key={suggestion.id_produto} href={`/product/${suggestion.id_produto}`}>
                <div className="flex flex-col items-center rounded-md border border-zinc-500 h-80 w-42 overflow-hidden transition-transform duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg text-center font-semibold p-4">{suggestion.nome_produto}</h2>
                    <Image
                      src={suggestion.imagem_produto}
                      height={140}
                      width={140}
                      alt={suggestion.nome_produto}
                    />
                    <span className="flex justify-between text-center p-6" style={{ fontSize: '18px' }}>R${suggestion.preco_produto.toFixed(2)}</span>
                  </div>
                <button className="bg-blue-500 hover:bg-green-500 border-none text-white text-base font-bold rounded-md mt-auto w-full px-4 py-2">
                  Comprar
                </button>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Modal de Sucesso Ao Adicionar Porduto no Carrinho*/}
          {AdicionadoCarrinho && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Sucesso!</h2>
              <p className="text-lg mb-6">O produto foi adicionado no carrinho com sucesso.</p>
              <button
                onClick={AdicionadoComSucesso}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Ok
              </button>
            </div>
          </div>
        )}
      <Footer />
    </main>
  );
};

export default ProductPage;
