
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, FileText, Shield, Users, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      features: [
        "1 contrato por mês",
        "Marca d'água incluída",
        "Formulário básico",
        "Suporte por email"
      ],
      limitations: ["Sem download de PDF", "Funcionalidades limitadas"],
      buttonText: "Começar Grátis",
      popular: false
    },
    {
      name: "Padrão",
      price: "R$ 19",
      period: "/mês",
      features: [
        "Até 10 contratos por mês",
        "PDF profissional sem marca d'água",
        "Download habilitado",
        "Todas as cláusulas básicas",
        "Suporte prioritário"
      ],
      limitations: [],
      buttonText: "Assinar Padrão",
      popular: true
    },
    {
      name: "Profissional",
      price: "R$ 39",
      period: "/mês",
      features: [
        "Contratos ilimitados",
        "Cláusulas personalizadas premium",
        "Assinatura online",
        "Histórico completo",
        "Suporte 24/7",
        "API de integração"
      ],
      limitations: [],
      buttonText: "Assinar Profissional",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Gere contratos profissionais em minutos
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            ContratoPronto.io
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A solução completa para freelancers, MEIs e pequenas empresas criarem contratos personalizados, 
            profissionais e juridicamente seguros em poucos cliques.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FileText className="w-5 h-5 mr-2" />
              Criar Meu Primeiro Contrato
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Formulário Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Responda perguntas simples e nosso sistema gera automaticamente um contrato personalizado para sua necessidade.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Juridicamente Seguro</h3>
              <p className="text-gray-600 leading-relaxed">
                Todos os contratos seguem as melhores práticas jurídicas e incluem cláusulas de proteção essenciais.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assinatura Digital</h3>
              <p className="text-gray-600 leading-relaxed">
                Envie contratos para assinatura online com validade jurídica e rastreamento completo.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comece gratuitamente e evolua conforme sua necessidade
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={plan.name}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 transform scale-105' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 mb-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start opacity-60">
                      <span className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-gray-400">×</span>
                      <span className="text-gray-500 line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">ContratoPronto.io</h3>
          <p className="text-gray-400 mb-8">
            Simplificando a criação de contratos para empreendedores brasileiros
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
