import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

// Componente que encapsula a lógica de verificação de login
function Protegido({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default Protegido;
