
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast({
            title: "Erro no login",
            description: "E-mail ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive"
          });
        }
      } else {
        if (formData.password.length < 6) {
          toast({
            title: "Senha muito curta",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        success = await register(formData.name, formData.email, formData.password);
        if (success) {
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu e-mail para confirmar a conta e fazer login.",
          });
          setIsLogin(true);
          setFormData({ name: "", email: formData.email, password: "" });
        } else {
          toast({
            title: "Erro ao criar conta",
            description: "Verifique se o e-mail é válido e tente novamente.",
            variant: "destructive"
          });
        }
      }

      if (success && isLogin) {
        toast({
          title: "Login realizado!",
          description: "Redirecionando para o dashboard...",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              ContratoPronto.io
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? "Entre para acessar seus contratos" 
              : "Comece a criar contratos profissionais hoje"
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={isLogin ? "Digite sua senha" : "Mínimo 6 caracteres"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  minLength={isLogin ? undefined : 6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isLoading ? "Carregando..." : (isLogin ? "Entrar" : "Criar Conta")}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
