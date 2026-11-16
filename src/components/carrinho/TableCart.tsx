import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/cartContext"; // Importa o contexto do carrinho
import { isMobile } from 'react-device-detect'; // Verifica dispositivo mobile
import React, { useState, useEffect } from 'react';
import QuantityInput from '@/components/common/QuantityInput';

export default function TableCart() {
  const { cart, removeFromCart, addQuantity, reduceQuantity, setQuantity } = useCart(); // Funções do contexto de carrinho
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Verifica se o dispositivo é mobile
    setIsMobileDevice(isMobile);
  }, []);

  return (
    <>
      {/* LAYOUT DESKTOP */}   
      {!isMobileDevice && cart.map((produto) => (
        <tr
          key={produto.id_produto}
          className="border-solid border-b-[3px] last:border-b-0"
        >
          <td className="p-7">
            <div className="flex items-center">
              <img
                src={produto.imagem_produto}
                alt={produto.nome_produto}
                className="rounded-md w-24 h-24"
              />
              <div className="ml-5">
                <div className="text-xl mb-2">{produto.nome_produto}</div>
              </div>
            </div>
          </td>
          <td>R${(produto.preco_produto).toFixed(2)}</td>
          <td>
            <div className="bg-zinc-200 inline-flex justify-around items-center h-7 min-w-[60px] rounded-2xl overflow-hidden">
              <button
                onClick={() => reduceQuantity(produto.id_produto)}
                className="flex items-center px-2 text-lg h-full hover:bg-zinc-400"
              >
                <Minus className="w-3 h-3" />
              </button>
              <QuantityInput
                value={produto.quantidade}
                label={`Quantidade de ${produto.nome_produto}`}
                onChange={(quantidade) => setQuantity(produto.id_produto, quantidade)}
                className="h-full"
              />
              <button
                onClick={() => addQuantity(produto.id_produto)}
                className="flex items-center px-2 text-lg h-full hover:bg-zinc-400"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </td>
          <td>R${(produto.preco_produto * produto.quantidade).toFixed(2)}</td>
          <td>
            <button
              onClick={() => removeFromCart(produto.id_produto)}
              className="flex rounded-full border-0 w-7 h-7 items-center justify-center text-xl bg-zinc-200 hover:bg-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}

      {/* LAYOUT MOBILE - FORMATO DE CARDS */}  
      {isMobileDevice && cart.map((produto) => (
        <div key={produto.id_produto} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <img
              src={produto.imagem_produto}
              alt={produto.nome_produto}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="ml-3 flex-grow">
              <div className="text-lg font-semibold">{produto.nome_produto}</div>
              <div className="text-gray-500">R${(produto.preco_produto).toFixed(2)}</div>
            </div>
            <button
              onClick={() => removeFromCart(produto.id_produto)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="bg-zinc-200 inline-flex justify-around items-center h-8 min-w-[90px] rounded-2xl">
              <button
                onClick={() => reduceQuantity(produto.id_produto)}
                className="flex items-center px-2 text-lg hover:bg-zinc-400"
              >
                <Minus className="w-4 h-4" />
              </button>
              <QuantityInput
                value={produto.quantidade}
                label={`Quantidade de ${produto.nome_produto}`}
                onChange={(quantidade) => setQuantity(produto.id_produto, quantidade)}
                className="h-full"
              />
              <button
                onClick={() => addQuantity(produto.id_produto)}
                className="flex items-center px-2 text-lg hover:bg-zinc-400"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-700 font-semibold">
              R${(produto.preco_produto * produto.quantidade).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
