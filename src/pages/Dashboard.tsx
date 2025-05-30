
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
  AlertCircle,
  Trash2
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Contract {
  id: string;
  titulo: string;
  dados_json: any;
  created_at: string;
  pdf_url: string | null;
}

const Dashboard = () => {
  const { user, updateContractsUsed } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    loadContracts();
  }, [user, navigate]);

  const loadContracts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setContracts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast({
        title: "Erro ao carregar contratos",
        description: "Não foi possível carregar seus contratos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (error) {
        throw error;
      }

      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      updateContractsUsed();
      
      toast({
        title: "Contrato excluído",
        description: "O contrato foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      toast({
        title: "Erro ao excluir contrato",
        description: "Não foi possível excluir o contrato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getContractValue = (contract: Contract) => {
    return contract.dados_json?.value || 'Não informado';
  };

  const getContractType = (contract: Contract) => {
    return contract.dados_json?.contractType || 'Tipo não informado';
  };

  const getContractParties = (contract: Contract) => {
    return {
      contractor: contract.dados_json?.contractorName || 'Não informado',
      contracted: contract.dados_json?.contractedName || 'Não informado'
    };
  };

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(contract.created_at) >= weekAgo;
    }
    return true;
  });

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
                  Criados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{contracts.length}</div>
                <p className="text-xs text-green-600 mt-1">Contratos salvos</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">
                  {contracts.filter(c => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(c.created_at) >= weekAgo;
                  }).length}
                </div>
                <p className="text-xs text-yellow-600 mt-1">Novos contratos</p>
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
                <Button
                  variant={filter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? "bg-blue-600 text-white" : ""}
                >
                  Todos
                </Button>
                <Button
                  variant={filter === 'recent' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter('recent')}
                  className={filter === 'recent' ? "bg-blue-600 text-white" : ""}
                >
                  Recentes
                </Button>
              </div>
            </div>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {loading ? (
              <Card className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando contratos...</p>
              </Card>
            ) : filteredContracts.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'Nenhum contrato encontrado' : 'Nenhum contrato recente'}
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
              filteredContracts.map((contract) => {
                const parties = getContractParties(contract);
                return (
                  <Card key={contract.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {contract.titulo}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                                </span>
                                <span>•</span>
                                <span>{getContractType(contract)}</span>
                                <span>•</span>
                                <span className="font-medium text-green-600">{getContractValue(contract)}</span>
                              </div>
                            </div>
                            
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Salvo
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Contratante:</span> {parties.contractor}
                              </div>
                              <div>
                                <span className="font-medium">Contratado:</span> {parties.contracted}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => {
                              // Funcionalidade de editar será implementada futuramente
                              toast({
                                title: "Em breve",
                                description: "Funcionalidade de edição será disponibilizada em breve.",
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            <span>Editar</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center space-x-2 hover:bg-green-50 hover:border-green-300"
                            onClick={() => {
                              // Funcionalidade de download será implementada futuramente
                              toast({
                                title: "Em breve",
                                description: "Funcionalidade de download será disponibilizada em breve.",
                              });
                            }}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </Button>

                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 text-red-600"
                            onClick={() => handleDeleteContract(contract.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
