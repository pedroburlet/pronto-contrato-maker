
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              ContratoPronto.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Como Funciona
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Preços
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Suporte
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Começar Grátis
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Como Funciona
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Preços
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                FAQ
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Suporte
              </a>
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate("/dashboard")}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate("/auth")}
                      variant="outline"
                      className="w-full"
                    >
                      Entrar
                    </Button>
                    <Button
                      onClick={() => navigate("/auth")}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      Começar Grátis
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
