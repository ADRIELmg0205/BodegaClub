import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Link from 'next/link';

interface PermissaoAdminProps {
  children: React.ReactNode;
}

const PermissaoAdmin: React.FC<PermissaoAdminProps> = ({ children }) => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (user && user.publicMetadata.cargo === 'admin') {
    return <>{children}</>;
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Acesso negado</h1>
        <p className="text-lg text-gray-700 mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <Link href="/" className="bg-blue-500 text-white text-lg font-semibold px-6 py-3 rounded hover:bg-blue-700 transition duration-300">
          Voltar para a Home
        </Link>
      </div>
      <Footer />
    </main>
  );
};

export default PermissaoAdmin;
