
import { Button } from "@/components/ui/button";
import { CommunityBranding } from "./CommunityBranding";
import { NavigationItems } from "./NavigationItems";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  handleAuthClick: () => void;
}

export const Header = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleAuthClick,
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <CommunityBranding />
          </div>

          <div className="md:flex items-center gap-4 hidden">
            <NavigationItems />
            <UserMenu handleAuthClick={handleAuthClick} />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
