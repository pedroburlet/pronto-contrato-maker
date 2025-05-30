
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'standard' | 'professional';
  contractsUsed: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateContractsUsed: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: User) => {
    try {
      // Buscar dados do usuário na tabela subscriptions
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      // Contar contratos do usuário
      const { count } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', supabaseUser.id);

      // Garantir que o plano seja um dos valores válidos
      let planType: 'free' | 'standard' | 'professional' = 'free';
      if (subscription?.plano === 'standard' || subscription?.plano === 'professional') {
        planType = subscription.plano as 'free' | 'standard' | 'professional';
      }

      const authUser: AuthUser = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
        email: supabaseUser.email || '',
        plan: planType,
        contractsUsed: count || 0
      };

      setUser(authUser);
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      
      // Criar registro padrão se não existir
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: supabaseUser.id,
          plano: 'free'
        });

      const authUser: AuthUser = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
        email: supabaseUser.email || '',
        plan: 'free',
        contractsUsed: 0
      };

      setUser(authUser);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Erro no registro:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateContractsUsed = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setUser(prev => prev ? { ...prev, contractsUsed: count || 0 } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateContractsUsed,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
