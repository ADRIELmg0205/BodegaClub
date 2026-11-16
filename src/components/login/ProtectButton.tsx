import { useRouter } from 'next/router';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface ProtectButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string; // Permite passar o className como prop
}

const ProtectButton: React.FC<ProtectButtonProps> = ({ children, onClick, className }) => {
  const router = useRouter();

  const handleAction = () => {
    onClick(); // Executa a ação se o usuário estiver logado
  };

  return (
    <>
      <SignedIn>
        <button onClick={handleAction} className={className}>
          {children}
        </button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <button className={className}>
            {children}
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default ProtectButton;
