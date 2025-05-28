
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Users,
  Shield,
  Play,
  Star
} from "lucide-react";
import { Header } from "@/components/Header";

const Demo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const demoSteps = [
    {
      title: "Escolha o Tipo de Contrato",
      description: "Selecione entre diversos tipos de contratos disponíveis",
      image: "📝",
      details: "Prestação de Serviço, Aluguel, Venda, Consultoria, Freelance e muito mais!"
    },
    {
      title: "Preencha os Dados",
      description: "Formulário inteligente guia você passo a passo",
      image: "📋",
      details: "Dados das partes, valores, prazos e condições específicas do seu contrato"
    },
    {
      title: "Adicione Cláusulas de Proteção",
      description: "Torne seu contrato mais seguro com cláusulas especiais",
      image: "🛡️",
      details: "Multas por cancelamento, atraso, confidencialidade e assinatura digital"
    },
    {
      title: "Contrato Pronto!",
      description: "PDF profissional gerado automaticamente",
      image: "✅",
      details: "Documento juridicamente válido pronto para assinatura e uso"
    }
  ];

  const sampleContract = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: João Silva - ME
CNPJ: 12.345.678/0001-90
Endereço: Rua das Flores, 123 - São Paulo/SP

CONTRATADO: Maria Santos Design
CPF: 123.456.789-00
Endereço: Av. Paulista, 456 - São Paulo/SP

OBJETO: Desenvolvimento de identidade visual completa incluindo logotipo, cartão de visita e material promocional para empresa.

VALOR: R$ 2.500,00
FORMA DE PAGAMENTO: 50% no início, 50% na entrega

PRAZO: 15 dias corridos
LOCAL E DATA: São Paulo, 15 de Janeiro de 2024

CLÁUSULAS ESPECIAIS:
✓ Multa por cancelamento: 30% do valor total
✓ Cláusula de confidencialidade incluída
✓ Assinatura digital habilitada

Este contrato foi gerado automaticamente pelo ContratoPronto.io
  `;

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Freelancer Designer",
      content: "Economizo horas toda semana! Antes levava dias para fazer um contrato, agora são minutos.",
      rating: 5
    },
    {
      name: "Ana Paula",
      role: "Consultora MEI",
      content: "Meus contratos ficaram muito mais profissionais. Clientes confiam mais no meu trabalho.",
      rating: 5
    },
    {
      name: "Roberto Silva",
      role: "Pequeno Empresário",
      content: "A segurança jurídica que eu precisava sem pagar caro por advogado. Recomendo!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mb-6 flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Início</span>
            </Button>
            
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4 mr-2" />
              Demonstração Interativa
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Veja Como Funciona
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como criar contratos profissionais em poucos minutos
            </p>
          </div>

          {/* Demo Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Processo Simples em 4 Passos
            </h2>
            
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {demoSteps.map((_, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => setCurrentStep(index + 1)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        currentStep === index + 1
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                    {index < demoSteps.length - 1 && (
                      <div className="w-16 h-1 bg-gray-200 rounded" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{demoSteps[currentStep - 1].image}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {demoSteps[currentStep - 1].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {demoSteps[currentStep - 1].description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {demoSteps[currentStep - 1].details}
                  </p>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    variant="outline"
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={currentStep === 4}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Contract */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Exemplo de Contrato Gerado
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Contrato Profissional</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs whitespace-pre-line max-h-96 overflow-y-auto border">
                    {sampleContract}
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 text-green-800 mb-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Juridicamente Válido</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Todos os contratos seguem as melhores práticas jurídicas brasileiras
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 text-blue-800 mb-3">
                      <Shield className="w-6 h-6" />
                      <span className="font-semibold">Cláusulas de Proteção</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Multas, confidencialidade e outras proteções incluídas automaticamente
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 text-purple-800 mb-3">
                      <FileText className="w-6 h-6" />
                      <span className="font-semibold">PDF Profissional</span>
                    </div>
                    <p className="text-purple-700 text-sm">
                      Download imediato em formato PDF pronto para impressão e assinatura
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              O Que Nossos Usuários Dizem
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Criar Seu Primeiro Contrato?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de empreendedores que já simplificaram seus negócios
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/auth")}
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <FileText className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
              
              <Button 
                onClick={() => navigate("/")}
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
