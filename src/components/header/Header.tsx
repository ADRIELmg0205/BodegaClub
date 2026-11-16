import React, { useState, useEffect } from 'react';
import Image from "next/image";
import logo from "../../images/logo.png";
import Carrinho from "../../images/carrinho.png";
import { HiOutlineSearch } from 'react-icons/hi';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect'; // Verifica dispositivo mobile
import { useCart } from '@/contexts/cartContext';

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  resetFilters?: () => void;
}

export default function Header({ searchTerm, setSearchTerm, resetFilters }: HeaderProps) {
  const router = useRouter();
  const { cart } = useCart();
  const differentItemsCount = cart.length;
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm ?? '');
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Verifica se o dispositivo é mobile
    setIsMobileDevice(isMobile);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?search=${localSearchTerm}`);
  };

  const handleLogoClick = () => {
    if (resetFilters) {
      resetFilters();
    }
    router.push('/');
  };

  return (
    <div className='w-full h-20 bg-Azul text-TextoBranco sticky top-0 z-50'>
      <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-4">
        <div
          onClick={handleLogoClick}
          className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 flex items-center justify-center h-[95%]"
        >
          <Image className="w-28 object-cover mt-1" src={logo} alt="logo.png" />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 h-10 inline-flex items-center justify-between relative">
        <input
          className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none"
          type="text"
          placeholder="Pesquisar Produtos"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <button type="submit" className="w-12 h-full text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md bg-Cinza">
          <HiOutlineSearch />
        </button>
      </form>

        {/* Botão de carrinho padrão para desktop */}
        {!isMobileDevice && (
          <Link
            href="/carrinho/cart"
            aria-label={`Carrinho, ${differentItemsCount} ${differentItemsCount === 1 ? 'produto diferente' : 'produtos diferentes'}`}
            className="relative flex h-[95%] items-center border border-transparent px-2 duration-300 hover:border-white"
          >
            <Image className="h-8 w-auto object-cover" src={Carrinho} alt="Carrinho" />
            {differentItemsCount > 0 && (
              <span className="absolute right-0 top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold leading-none text-white">
                {differentItemsCount}
              </span>
            )}
            </Link>
        )}

        {/* Menu "Meu Perfil" apenas para dispositivos não mobile */}
        {!isMobileDevice && (
          <button className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[95%] relative">
            <Link href="/MeuPerfil">
              <div>
                <p className='text-sm text-white flex flex-col justify-center border border-transparent cursor-pointer duration-300 h-[95%] rounded-md border-gray-400 px-3 py-2'>
                  Meu Perfil
                </p>
              </div>
            </Link>
          </button>
        )}

        <div className='flex items-center gap-8'>
          <SignedIn>
            {/* Exibe o nome do usuário logado para dispositivos não mobile */}
            {!isMobileDevice && (
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-white rounded-full"></div>
                <UserButton showName={true} />
              </div>
            )}
            {/* Exibe apenas o ícone do usuário em dispositivos mobile */}
            {isMobileDevice && (
              <div className="relative">
                <UserButton />
              </div>             
            )}
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='text-sm text-white flex flex-col justify-center border border-transparent hover:border-white cursor-pointer duration-300 h-[95%] rounded-md border-gray-400 px-3 py-2'>
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Botões fixos para mobile no lado esquerdo */}
      {isMobileDevice && (
        <>
          <div className="fixed bottom-20 left-4 z-50">
            <Link
              href="/carrinho/cart"
              aria-label={`Carrinho, ${differentItemsCount} ${differentItemsCount === 1 ? 'produto diferente' : 'produtos diferentes'}`}
              className="relative block rounded-full bg-Azul p-2 shadow-lg"
            >
              <Image className="h-10 w-10 object-cover" src={Carrinho} alt="Carrinho" />
              {differentItemsCount > 0 && (
                <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold leading-none text-white">
                  {differentItemsCount}
                </span>
              )}
            </Link>
          </div>

        </>
      )}
    </div>
  );
}
