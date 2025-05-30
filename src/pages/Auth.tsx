
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
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
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEmailConfirmation(false);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast({
            title: "Erro no login",
            description: "E-mail ou senha incorretos. Se você acabou de se cadastrar, verifique se confirmou seu e-mail clicando no link que enviamos.",
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
          setShowEmailConfirmation(true);
          toast({
            title: "Conta criada com sucesso!",
            description: "Enviamos um e-mail de confirmação. Clique no link para ativar sua conta.",
            duration: 10000,
          });
          setFormData({ name: "", email: formData.email, password: "" });
        } else {
          toast({
            title: "Erro ao criar conta",
            description: "Verifique se o e-mail é válido e não está em uso.",
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

        {/* Email Confirmation Message */}
        {showEmailConfirmation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Confirme seu e-mail</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Enviamos um link de confirmação para <strong>{formData.email}</strong>. 
                  Clique no link para ativar sua conta e fazer login.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Não recebeu? Verifique sua caixa de spam ou tente novamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Instructions */}
        {isLogin && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Problemas para entrar?</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Se você acabou de se cadastrar, verifique seu e-mail e clique no link de confirmação antes de fazer login.
                </p>
              </div>
            </div>
          </div>
        )}

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

            {!isLogin && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 flex items-start space-x-2">
                  <Mail className="w-4 h-4 mt-0.5 text-gray-400" />
                  <span>
                    Após criar sua conta, você receberá um e-mail de confirmação. 
                    Clique no link para ativar sua conta antes de fazer login.
                  </span>
                </p>
              </div>
            )}

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
                  setShowEmailConfirmation(false);
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
