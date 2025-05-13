import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@pastry.com' && password === 'password') {
          const userData: User = {
            id: '1',
            name: 'Administrador',
            email: 'admin@pastry.com',
            password: 'password',
            role: 'admin',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else if (email === 'staff@pastry.com' && password === 'password') {
          const userData: User = {
            id: '2',
            name: 'Funcionário',
            email: 'staff@pastry.com',
            password: 'password',
            role: 'staff',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          // Verifica usuários cadastrados no localStorage
          const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
          const found = users.find((u: User) => u.email === email && u.password === password);
          if (found) {
            const userData: User = {
              id: found.id,
              name: found.name,
              email: found.email,
              password: found.password,
              role: found.role,
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            resolve();
          } else {
            reject(new Error('Credenciais inválidas'));
          }
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};