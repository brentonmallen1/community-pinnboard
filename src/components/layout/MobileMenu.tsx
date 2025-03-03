
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenuItems } from "./MobileMenuItems";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4">
      <MobileMenuItems onSignOut={handleSignOut} />
    </div>
  );
};
