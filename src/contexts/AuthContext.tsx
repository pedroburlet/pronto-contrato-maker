
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'standard' | 'professional';
  contractsUsed: number;
  contractsLimit: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateContractsUsed: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('contractpronto_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em produção seria uma API real
    if (email && password) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        plan: 'free',
        contractsUsed: 0,
        contractsLimit: 1
      };
      setUser(userData);
      localStorage.setItem('contractpronto_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulação de registro - em produção seria uma API real
    if (name && email && password) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        plan: 'free',
        contractsUsed: 0,
        contractsLimit: 1
      };
      setUser(userData);
      localStorage.setItem('contractpronto_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('contractpronto_user');
  };

  const updateContractsUsed = () => {
    if (user) {
      const updatedUser = { ...user, contractsUsed: user.contractsUsed + 1 };
      setUser(updatedUser);
      localStorage.setItem('contractpronto_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateContractsUsed }}>
      {children}
    </AuthContext.Provider>
  );
};
