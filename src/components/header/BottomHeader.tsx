import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAndroid, isIOS } from 'react-device-detect'; // Detectar dispositivos Android e iOS
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones para o menu
import Link from 'next/link';

interface BottomHeaderProps {
  setCategory: (category: string) => void;
}

export default function BottomHeader({ setCategory }: BottomHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verifica se o dispositivo é Android ou iOS
    if (isAndroid || isIOS) {
      setIsMobile(true);
    }
  }, []);

  const handleCategoryClick = (category: string) => {
    setCategory(category);
    router.push(`/?category=${category}`);
    setMenuOpen(false); // Fecha o menu ao clicar na categoria
  };

  const AbreClube = () => {
    router.push(`/clube/home`);
    setMenuOpen(false); // Fecha o menu ao abrir o clube
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const AbrirForms = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScN9GliiHVyIgCm3PAvo9X-etfsuZjw8Un34c1t4nN2wuTMng/viewform?usp=sf_link', '_blank');
  };

  return (
    <div className="relative w-full">
      {/* Ícone de menu hambúrguer visível em Android e iOS */}
      {isMobile && (
        <button
          className="fixed left-4 bottom-4 p-4 text-white bg-Azul rounded-full shadow-lg z-50"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />} {/* Ícones de abrir/fechar menu */}
        </button>
      )}

      {/* Sobreposição quando o menu estiver aberto */}
      {menuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>}

      {/* Menu lateral (drawer) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-Azul text-white p-6 z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-lg font-bold mb-6">Bodega Club!</h2>
        <button className="block w-full text-left mb-4 text-lg">
          <Link href="/MeuPerfil">
            🍻 Meu Perfil
          </Link>
        </button>
        <button onClick={() => AbreClube()} className="block w-full text-left mb-4 text-lg">
          🎟 Clube de Assinatura
        </button>
        <button onClick={AbrirForms} className="block w-full text-left mb-4 text-lg">
          💯 Avalie sua experiência clicando aqui!
        </button>
        <br></br>
        <h2 className="text-lg font-bold mb-6">Categorias</h2>
        <button onClick={() => handleCategoryClick('cerveja')} className="block w-full text-left mb-4 text-lg">
          🍺 Cervejas
        </button>
        <button onClick={() => handleCategoryClick('vinhos')} className="block w-full text-left mb-4 text-lg">
          🍷 Vinhos
        </button>
        <button onClick={() => handleCategoryClick('whisky')} className="block w-full text-left mb-4 text-lg">
          🥃 Whiskys
        </button>
        <button onClick={() => handleCategoryClick('refrigerante')} className="block w-full text-left mb-4 text-lg">
          🥤 Refrigerantes
        </button>
        <button onClick={() => handleCategoryClick('energetico')} className="block w-full text-left mb-4 text-lg">
          ⚡ Energéticos
        </button>
        <button onClick={() => handleCategoryClick('vodka')} className="block w-full text-left mb-4 text-lg">
          🍸 Vodkas
        </button>
        <button onClick={() => handleCategoryClick('todos')} className="block w-full text-left text-lg">
          🔄 Todos
        </button>
      </div>

      {/* Versão original do menu para telas maiores */}
      <div className="hidden md:flex justify-center items-center w-full h-10 bg-Azul text-sm text-white px-4">
        <button onClick={() => handleCategoryClick('cerveja')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Cervejas
        </button>
        <button onClick={() => handleCategoryClick('whisky')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Whiskys
        </button>
        <button onClick={() => handleCategoryClick('refrigerante')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Refrigerantes
        </button>
        <button onClick={() => handleCategoryClick('energetico')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Energéticos
        </button>
        <button onClick={() => handleCategoryClick('vinhos')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Vinhos
        </button>
        <button onClick={() => AbreClube()} className="font-bold items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Clube de Assinatura
        </button>
        <button onClick={() => handleCategoryClick('todos')} className="items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 text-white mx-4">
          Todos
        </button>
      </div>
    </div>
  );
}
