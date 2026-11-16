// pages/perfil.js
import { UserProfile } from "@clerk/nextjs";

export default function Perfil() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <UserProfile routing="hash" />
    </div>
  );
}
