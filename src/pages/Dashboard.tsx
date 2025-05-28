
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Filter,
  Download,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface Contract {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'pending' | 'signed';
  createdAt: string;
  value: string;
  parties: {
    contractor: string;
    contracted: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'signed'>('all');

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Simulação de contratos - em produção viria da API
    const mockContracts: Contract[] = [
      {
        id: '1',
        title: 'Contrato de Desenvolvimento de Website',
        type: 'Prestação de Serviço',
        status: 'signed',
        createdAt: '2024-05-20',
        value: 'R$ 2.500,00',
        parties: {
          contractor: 'João Silva',
          contracted: 'Tech Solutions LTDA'
        }
      },
      {
        id: '2',
        title: 'Contrato de Consultoria',
        type: 'Prestação de Serviço',
        status: 'pending',
        createdAt: '2024-05-25',
        value: 'R$ 1.200,00',
        parties: {
          contractor: 'Maria Santos',
          contracted: 'João Silva'
        }
      }
    ];
    
    setContracts(mockContracts);
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Assinado';
      case 'pending':
        return 'Pendente';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const filteredContracts = contracts.filter(contract => 
    filter === 'all' || contract.status === filter
  );

  const canCreateContract = () => {
    if (!user) return false;
    
    switch (user.plan) {
      case 'free':
        return user.contractsUsed < 1;
      case 'standard':
        return user.contractsUsed < 10;
      case 'professional':
        return true;
      default:
        return false;
    }
  };

  const getPlanLimitText = () => {
    if (!user) return '';
    
    switch (user.plan) {
      case 'free':
        return `${user.contractsUsed}/1 contratos usados`;
      case 'standard':
        return `${user.contractsUsed}/10 contratos usados`;
      case 'professional':
        return 'Contratos ilimitados';
      default:
        return '';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Olá, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              Gerencie seus contratos e crie novos documentos profissionais
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Total de Contratos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{contracts.length}</div>
                <p className="text-xs text-blue-600 mt-1">{getPlanLimitText()}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assinados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {contracts.filter(c => c.status === 'signed').length}
                </div>
                <p className="text-xs text-green-600 mt-1">Contratos finalizados</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">
                  {contracts.filter(c => c.status === 'pending').length}
                </div>
                <p className="text-xs text-yellow-600 mt-1">Aguardando assinatura</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-900 capitalize">
                  {user.plan === 'free' ? 'Gratuito' : user.plan === 'standard' ? 'Padrão' : 'Profissional'}
                </div>
                <Button 
                  variant="link" 
                  className="text-xs text-purple-600 p-0 h-auto mt-1"
                  onClick={() => navigate("/")}
                >
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => canCreateContract() ? navigate("/create-contract") : null}
                disabled={!canCreateContract()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
              
              {!canCreateContract() && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  Limite de contratos atingido. Faça upgrade do plano.
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Filtrar:</span>
              </div>
              
              <div className="flex space-x-2">
                {['all', 'draft', 'pending', 'signed'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(status as any)}
                    className={filter === status ? "bg-blue-600 text-white" : ""}
                  >
                    {status === 'all' ? 'Todos' : getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'Nenhum contrato encontrado' : `Nenhum contrato ${getStatusLabel(filter).toLowerCase()}`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? 'Comece criando seu primeiro contrato profissional'
                    : 'Altere o filtro para ver outros contratos'
                  }
                </p>
                {canCreateContract() && filter === 'all' && (
                  <Button
                    onClick={() => navigate("/create-contract")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Contrato
                  </Button>
                )}
              </Card>
            ) : (
              filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {contract.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                              <span>•</span>
                              <span>{contract.type}</span>
                              <span>•</span>
                              <span className="font-medium text-green-600">{contract.value}</span>
                            </div>
                          </div>
                          
                          <Badge className={`${getStatusColor(contract.status)} flex items-center space-x-1`}>
                            {getStatusIcon(contract.status)}
                            <span>{getStatusLabel(contract.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium">Contratante:</span> {contract.parties.contractor}
                            </div>
                            <div>
                              <span className="font-medium">Contratado:</span> {contract.parties.contracted}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center space-x-2 hover:bg-green-50 hover:border-green-300"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
