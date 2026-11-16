import { useCart } from "@/contexts/cartContext";
import FinalizarPedido from "./FinalizarPedido"; // Importe o componente de FinalizarPedido

export default function Resumo() {
  const { cart } = useCart();

  // Calcula o valor total dos produtos no carrinho
  const total = cart.reduce((acc, produto) => {
    return acc + produto.preco_produto * produto.quantidade;
  }, 0);

  return (
    <div className="p-6 border border-gray-300 rounded-lg w-full max-w-lg mx-auto bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Resumo do Pedido</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {cart.map((produto) => (
            <div
              key={produto.id_produto}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex flex-col">
                <span className="text-lg font-medium">{produto.nome_produto}</span>
                <span className="text-sm text-gray-500">Quantidade: {produto.quantidade}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-medium">R${produto.preco_produto.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                  Total: R${(produto.preco_produto * produto.quantidade).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Total Geral */}
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <h3 className="text-xl font-bold">Total Geral:</h3>
            <h3 className="text-xl font-bold">R${total.toFixed(2)}</h3>
          </div>

          {/* Espaçamento para o botão de Finalizar Pedido */}
          <div className="mt-36">
            {/* Adiciona o botão de Finalizar Pedido */}
            <FinalizarPedido />
          </div>
        </div>
      )}
    </div>
  );
}








// import { useCart } from "@/contexts/cartContext"

// export default function Resumo() {
//     const {cart} = useCart();
//     const total = cart.reduce((acc, produto) => acc + produto.preco_produto * produto.quantidade, 0)
//     return (
//         <div>
//             <div className="mb-4 border border-solid border-zinc-200 bg-zinc-300">
//                 <header className="p-3 text-lg border border-solid border-zinc-200">Resumo da Compra</header>
//                 <div className="p-5 mb-3">
//                     <div className="flex justify-between">
//                         <span>Sub-Total</span>
//                         <span>R$ 299,90</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span>Frete</span>
//                         <span>R$ 10,99</span>
//                     </div>
//                 </div>
//                 <footer className=" flex justify-between p-3 text-base bg-zinc-400">
//                     <span>Total</span>
//                     <span>R${total.toFixed(2)}</span>
//                 </footer>
//             </div>
//             <button className="bg-green-700 block w-full text-white p-4 uppercase tracking-[1px] ">Finalizar Compra</button>
//         </div>
//     )
// }