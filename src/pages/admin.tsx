import { useRouter } from 'next/router';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProtectPageAdmin from "@/components/login/ProtectPageAdmin";

export default function Home() {
  const router = useRouter();

  const goToProdutos = () => {
    router.push('/cadastroprodutos/cadastra_produtos');
  };

  const goToPedidos = () => {
    router.push('/pedidos/todospedidos');
  };

  const goToUsuarios = () => {
    window.open('https://clerk.com', '_blank');
  };

  const goToAssinaturas = () => {
    router.push('/clube/assinaturas/assinaturas');
  };

  return (
    <ProtectPageAdmin>
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-grow">
        <div className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800">Bem vindo ao Bodega Club!!</h1>
          <p className="text-xl text-gray-600 mt-2">Qual módulo deseja acessar?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-10">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl"
            onClick={goToProdutos}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Produtos</h2>
            <p className="text-white text-lg">Gerencie seus produtos disponíveis.</p>
          </div>

          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl"
            onClick={goToPedidos}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Pedidos</h2>
            <p className="text-white text-lg">Veja e gerencie os pedidos.</p>
          </div>

          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl"
            onClick={goToUsuarios}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Usuários</h2>
            <p className="text-white text-lg">Controle o acesso dos usuários.</p>
          </div>

          <div 
            className="bg-gradient-to-r from-red-400 to-red-600 shadow-lg rounded-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl"
            onClick={goToAssinaturas}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Assinaturas</h2>
            <p className="text-white text-lg">Gerencie os planos de assinatura.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </ProtectPageAdmin>
  );
}
