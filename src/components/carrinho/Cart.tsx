import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect'; // Verifica dispositivo mobile
import TableCart from './TableCart';
import Resumo from './Resumo';
import FinalizarPedido from './FinalizarPedido'; // Importa o componente FinalizarPedido

export default function Cart() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Verifica se o dispositivo é mobile
    setIsMobileDevice(isMobile);
  }, []);

  return (
    <main className="p-8 relative min-h-screen">
      <div className="text-4xl p-12 text-center">Meu Carrinho</div>

      <div className={`flex ${isMobileDevice ? 'flex-col' : ''}`}>
        <section className="flex-1">
          <table className="w-full border-collapse">
            {!isMobileDevice && (
              <thead className="border-b-2">
                <tr className="text-left uppercase text-zinc-400">
                  <th className="pb-[10px]">Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>~</th>
                </tr>
              </thead>
            )}
            <tbody>
              <TableCart />
            </tbody>
          </table>
        </section>
        
        {/* LAYOUT DESKTOP - EXIBE O RESUMO AO LADO */}
        {!isMobileDevice && (
          <aside className="ml-7">
            <Resumo />
          </aside>
        )}

        {/* LAYOUT MOBILE - FIXA O RESUMO NA PARTE INFERIOR */}
        {isMobileDevice && (
          <div className="">
            <Resumo />
          </div>
        )}
      </div>
    </main>
  );
}
