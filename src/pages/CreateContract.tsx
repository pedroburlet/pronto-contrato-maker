import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Users,
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ContractData {
  // Partes
  contractorName: string;
  contractorDocument: string;
  contractorAddress: string;
  contractedName: string;
  contractedDocument: string;
  contractedAddress: string;
  
  // Contrato
  contractType: string;
  contractObject: string;
  value: string;
  paymentMethod: string;
  duration: string;
  location: string;
  date: string;
  
  // Cláusulas opcionais
  cancellationFine: boolean;
  cancellationFineValue: string;
  delayFine: boolean;
  delayFineValue: string;
  confidentiality: boolean;
  onlineSignature: boolean;
}

const CreateContract = () => {
  const { user, updateContractsUsed } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [contractData, setContractData] = useState<ContractData>({
    contractorName: "",
    contractorDocument: "",
    contractorAddress: "",
    contractedName: "",
    contractedDocument: "",
    contractedAddress: "",
    contractType: "",
    contractObject: "",
    value: "",
    paymentMethod: "",
    duration: "",
    location: "",
    date: "",
    cancellationFine: false,
    cancellationFineValue: "",
    delayFine: false,
    delayFineValue: "",
    confidentiality: false,
    onlineSignature: false
  });

  const contractTypes = [
    "Prestação de Serviço",
    "Aluguel",
    "Venda",
    "Consultoria",
    "Freelance",
    "Parceria",
    "Licenciamento",
    "Outros"
  ];

  const steps = [
    { number: 1, title: "Dados das Partes", icon: Users },
    { number: 2, title: "Detalhes do Contrato", icon: FileText },
    { number: 3, title: "Cláusulas Especiais", icon: Shield },
    { number: 4, title: "Revisão Final", icon: CheckCircle }
  ];

  const handleInputChange = (field: keyof ContractData, value: string | boolean) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return contractData.contractorName && contractData.contractedName;
      case 2:
        return contractData.contractType && contractData.contractObject && contractData.value;
      case 3:
        return true; // Cláusulas são opcionais
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Simular criação do contrato
    updateContractsUsed();
    
    toast({
      title: "Contrato criado com sucesso!",
      description: "Seu contrato foi gerado e está disponível no dashboard.",
    });
    
    navigate("/dashboard");
  };

  const generatePreview = () => {
    return `
CONTRATO DE ${contractData.contractType.toUpperCase()}

CONTRATANTE: ${contractData.contractorName}
CONTRATADO: ${contractData.contractedName}

OBJETO: ${contractData.contractObject}

VALOR: ${contractData.value}
FORMA DE PAGAMENTO: ${contractData.paymentMethod || "A definir"}

DURAÇÃO: ${contractData.duration || "A definir"}
LOCAL E DATA: ${contractData.location || "A definir"}, ${contractData.date || "A definir"}

${contractData.cancellationFine ? `MULTA POR CANCELAMENTO: ${contractData.cancellationFineValue}` : ''}
${contractData.delayFine ? `MULTA POR ATRASO: ${contractData.delayFineValue}` : ''}
${contractData.confidentiality ? 'CLÁUSULA DE CONFIDENCIALIDADE: Incluída' : ''}
${contractData.onlineSignature ? 'ASSINATURA ONLINE: Habilitada' : ''}
    `;
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Contrato</h1>
                <p className="text-gray-600">Passo {currentStep} de 4</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Plano {user.plan === 'free' ? 'Gratuito' : user.plan === 'standard' ? 'Padrão' : 'Profissional'}
            </Badge>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-16 h-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
                    <span>{steps[currentStep - 1].title}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Step 1: Dados das Partes */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600" />
                            Contratante
                          </h3>
                          
                          <div>
                            <Label htmlFor="contractorName">Nome / Razão Social *</Label>
                            <Input
                              id="contractorName"
                              value={contractData.contractorName}
                              onChange={(e) => handleInputChange('contractorName', e.target.value)}
                              placeholder="Nome completo ou empresa"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contractorDocument">CPF / CNPJ</Label>
                            <Input
                              id="contractorDocument"
                              value={contractData.contractorDocument}
                              onChange={(e) => handleInputChange('contractorDocument', e.target.value)}
                              placeholder="000.000.000-00"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contractorAddress">Endereço</Label>
                            <Textarea
                              id="contractorAddress"
                              value={contractData.contractorAddress}
                              onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                              placeholder="Endereço completo"
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            Contratado
                          </h3>
                          
                          <div>
                            <Label htmlFor="contractedName">Nome / Razão Social *</Label>
                            <Input
                              id="contractedName"
                              value={contractData.contractedName}
                              onChange={(e) => handleInputChange('contractedName', e.target.value)}
                              placeholder="Nome completo ou empresa"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contractedDocument">CPF / CNPJ</Label>
                            <Input
                              id="contractedDocument"
                              value={contractData.contractedDocument}
                              onChange={(e) => handleInputChange('contractedDocument', e.target.value)}
                              placeholder="000.000.000-00"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contractedAddress">Endereço</Label>
                            <Textarea
                              id="contractedAddress"
                              value={contractData.contractedAddress}
                              onChange={(e) => handleInputChange('contractedAddress', e.target.value)}
                              placeholder="Endereço completo"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Detalhes do Contrato */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="contractType">Tipo de Contrato *</Label>
                          <Select 
                            value={contractData.contractType} 
                            onValueChange={(value) => handleInputChange('contractType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {contractTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="value">Valor *</Label>
                          <Input
                            id="value"
                            value={contractData.value}
                            onChange={(e) => handleInputChange('value', e.target.value)}
                            placeholder="R$ 1.000,00"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="contractObject">Objeto do Contrato *</Label>
                        <Textarea
                          id="contractObject"
                          value={contractData.contractObject}
                          onChange={(e) => handleInputChange('contractObject', e.target.value)}
                          placeholder="Ex: Desenvolvimento de website institucional com 5 páginas..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                          <Input
                            id="paymentMethod"
                            value={contractData.paymentMethod}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            placeholder="Ex: 50% adiantado, 50% na entrega"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="duration">Duração</Label>
                          <Input
                            id="duration"
                            value={contractData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            placeholder="Ex: 30 dias, 6 meses"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="location">Local</Label>
                          <Input
                            id="location"
                            value={contractData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Ex: São Paulo - SP"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="date">Data</Label>
                          <Input
                            id="date"
                            type="date"
                            value={contractData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Cláusulas Especiais */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-800 mb-2">
                          <Shield className="w-5 h-5" />
                          <span className="font-semibold">Cláusulas de Proteção</span>
                        </div>
                        <p className="text-blue-700 text-sm">
                          Adicione cláusulas especiais para maior segurança jurídica do seu contrato.
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Checkbox
                              id="cancellationFine"
                              checked={contractData.cancellationFine}
                              onCheckedChange={(checked) => handleInputChange('cancellationFine', checked as boolean)}
                            />
                            <Label htmlFor="cancellationFine" className="flex items-center space-x-2 font-medium">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span>Multa por Cancelamento</span>
                            </Label>
                          </div>
                          {contractData.cancellationFine && (
                            <Input
                              value={contractData.cancellationFineValue}
                              onChange={(e) => handleInputChange('cancellationFineValue', e.target.value)}
                              placeholder="Ex: 30% do valor do contrato"
                              className="mt-3"
                            />
                          )}
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Checkbox
                              id="delayFine"
                              checked={contractData.delayFine}
                              onCheckedChange={(checked) => handleInputChange('delayFine', checked as boolean)}
                            />
                            <Label htmlFor="delayFine" className="flex items-center space-x-2 font-medium">
                              <Clock className="w-4 h-4 text-red-500" />
                              <span>Multa por Atraso</span>
                            </Label>
                          </div>
                          {contractData.delayFine && (
                            <Input
                              value={contractData.delayFineValue}
                              onChange={(e) => handleInputChange('delayFineValue', e.target.value)}
                              placeholder="Ex: 2% ao mês sobre o valor em atraso"
                              className="mt-3"
                            />
                          )}
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="confidentiality"
                              checked={contractData.confidentiality}
                              onCheckedChange={(checked) => handleInputChange('confidentiality', checked as boolean)}
                            />
                            <Label htmlFor="confidentiality" className="flex items-center space-x-2 font-medium">
                              <Shield className="w-4 h-4 text-blue-500" />
                              <span>Cláusula de Confidencialidade</span>
                            </Label>
                          </div>
                          {contractData.confidentiality && (
                            <p className="text-sm text-gray-600 mt-2">
                              Inclui proteção de informações confidenciais trocadas durante a execução do contrato.
                            </p>
                          )}
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="onlineSignature"
                              checked={contractData.onlineSignature}
                              onCheckedChange={(checked) => handleInputChange('onlineSignature', checked as boolean)}
                            />
                            <Label htmlFor="onlineSignature" className="flex items-center space-x-2 font-medium">
                              <FileText className="w-4 h-4 text-green-500" />
                              <span>Assinatura Online</span>
                            </Label>
                          </div>
                          {contractData.onlineSignature && (
                            <p className="text-sm text-gray-600 mt-2">
                              Permite que as partes assinem o contrato digitalmente com validade jurídica.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Revisão Final */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 text-green-800 mb-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Revisão Final</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          Revise todas as informações antes de gerar o contrato final.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Resumo do Contrato:</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Tipo:</span> {contractData.contractType}
                          </div>
                          <div>
                            <span className="font-medium">Valor:</span> {contractData.value}
                          </div>
                          <div>
                            <span className="font-medium">Contratante:</span> {contractData.contractorName}
                          </div>
                          <div>
                            <span className="font-medium">Contratado:</span> {contractData.contractedName}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Objeto:</span> {contractData.contractObject}
                          </div>
                        </div>
                        
                        {(contractData.cancellationFine || contractData.delayFine || contractData.confidentiality || contractData.onlineSignature) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="font-medium text-gray-900">Cláusulas Especiais:</span>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                              {contractData.cancellationFine && <li>Multa por cancelamento</li>}
                              {contractData.delayFine && <li>Multa por atraso</li>}
                              {contractData.confidentiality && <li>Confidencialidade</li>}
                              {contractData.onlineSignature && <li>Assinatura online</li>}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono whitespace-pre-line max-h-96 overflow-y-auto">
                    {generatePreview()}
                  </div>
                  
                  {user.plan === 'free' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Plano Gratuito:</strong> O PDF final terá marca d'água "ContratoPronto.io"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Gerar Contrato</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
