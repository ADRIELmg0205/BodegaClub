import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface para definir o tipo de produto no carrinho
interface Produto {
  id_produto: number;
  nome_produto: string;
  preco_produto: number;
  descricao_produto: string;
  imagem_produto: string;
  quantidade: number; // Adiciona o campo quantidade
}

interface CartContextData {
  cart: Produto[];
  addToCart: (produto: Produto) => void;
  removeFromCart: (id_produto: number) => void;
  addQuantity: (id_produto: number) => void;
  reduceQuantity: (id_produto: number) => void;
  setQuantity: (id_produto: number, quantidade: number) => void;
  clearCart: () => void; // Adiciona a função para limpar o carrinho
}

// Inicializando o contexto do carrinho
const CartContext = createContext<CartContextData | undefined>(undefined);

// Função para salvar o estado do carrinho no localStorage
const saveCartToLocalStorage = (cart: Produto[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Função para carregar o carrinho do localStorage
const loadCartFromLocalStorage = (): Produto[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

// Provedor de contexto para o carrinho
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Produto[]>([]);

  // Carrega o carrinho do localStorage na inicialização
  useEffect(() => {
    const storedCart = loadCartFromLocalStorage();
    if (storedCart.length > 0) {
      setCart(storedCart);
    }
  }, []);

  // Atualiza o localStorage sempre que o carrinho for modificado
  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  // Função para adicionar produtos ao carrinho
  const addToCart = (produto: Produto) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(p => p.id_produto === produto.id_produto);

      // Se o produto já está no carrinho, aumenta a quantidade
      if (existingProduct) {
        return prevCart.map(p =>
          p.id_produto === produto.id_produto
            ? { ...p, quantidade: p.quantidade + produto.quantidade } // Usa a quantidade do produto
            : p
        );
      }

      // Caso contrário, adiciona um novo produto com a quantidade selecionada
      return [...prevCart, { ...produto, quantidade: produto.quantidade }];
    });
  };

  // Função para remover produtos do carrinho
  const removeFromCart = (id_produto: number) => {
    setCart((prevCart) => prevCart.filter(p => p.id_produto !== id_produto));
  };

  // Função para aumentar a quantidade de um produto
  const addQuantity = (id_produto: number) => {
    setCart((prevCart) =>
      prevCart.map(p =>
        p.id_produto === id_produto
          ? { ...p, quantidade: p.quantidade + 1 }
          : p
      )
    );
  };

  // Função para reduzir a quantidade de um produto
  const reduceQuantity = (id_produto: number) => {
    setCart((prevCart) => {
      const product = prevCart.find(p => p.id_produto === id_produto);

      // Se a quantidade é 1, remove o produto
      if (product && product.quantidade === 1) {
        return prevCart.filter(p => p.id_produto !== id_produto);
      }

      // Caso contrário, reduz a quantidade
      return prevCart.map(p =>
        p.id_produto === id_produto
          ? { ...p, quantidade: p.quantidade - 1 }
          : p
      );
    });
  };

  const setQuantity = (id_produto: number, quantidade: number) => {
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) return;

    setCart((prevCart) =>
      prevCart.map((produto) =>
        produto.id_produto === id_produto ? { ...produto, quantidade } : produto
      )
    );
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        addQuantity,
        reduceQuantity,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para acessar o contexto do carrinho
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
