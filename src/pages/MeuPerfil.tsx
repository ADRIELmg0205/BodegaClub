import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProtectPage from "@/components/login/ProtectPage";
import GostosModal from "@/components/gostos/GostosModal"; // Certifique-se de que o caminho está correto
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const [isGostosModalOpen, setIsGostosModalOpen] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    // Log para monitorar se o userId é recuperado corretamente
    console.log("userId recuperado do Clerk:", userId);
  }, [userId]);

  // Supondo que o id do usuário logado esteja disponível em algum contexto
  const idUsuarioClerk = userId; // Substitua com o ID correto do usuário logado

  const goToPedidos = () => {
    router.push(`/pedidos/meuspedidos`);
  };

  const goToUser = () => {
    router.push('/perfil/Perfil');
  };

  const goToAssinaturas = () => {
    router.push('/clube/minhasassinaturas/meus-pedidos');
  };

  const openGostosModal = () => {
    setIsGostosModalOpen(true);
  };

  const closeGostosModal = () => {
    setIsGostosModalOpen(false);
  };

  return (
    <ProtectPage>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="text-center my-8">
            <h1 className="text-4xl font-bold text-gray-800">Bem vindo ao Seu Perfil Bodega Club!</h1>
            <p className="text-xl text-gray-600 mt-2">Aqui você pode acessar seu perfil, seus pedidos e suas assinaturas!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 p-10">
            <div onClick={goToPedidos} className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Meus Pedidos</h2>
            </div>

            <div onClick={goToAssinaturas} className="bg-gradient-to-r from-red-400 to-red-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Minhas Assinaturas</h2>
            </div>

            <div onClick={goToUser} className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Meu Perfil</h2>
            </div>

            <div onClick={openGostosModal} className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Meus Gostos</h2>
            </div>
          </div>
        </main>
        <Footer />

        {isGostosModalOpen && (
          <GostosModal
            onClose={closeGostosModal}
            idUsuarioClerk={userId!}
            isOpen={isGostosModalOpen}
          />
        )}
      </div>
    </ProtectPage>
  );
}
