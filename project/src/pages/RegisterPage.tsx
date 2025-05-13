import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email || !password || !name) {
      setError('Preencha todos os campos.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // Simulação de cadastro usando localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('Email já cadastrado.');
      setIsLoading(false);
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // Em produção, use hash!
      role: 'staff',
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Cadastro realizado com sucesso!');
    setTimeout(() => navigate('/login'), 1500);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Cadastro de Usuário</h1>
            <p className="text-gray-600 mt-2">Crie sua conta para acessar o sistema</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <Input
              label="Nome"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Digite seu nome"
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
              fullWidth
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Crie uma senha"
              fullWidth
            />
            <Input
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme sua senha"
              fullWidth
            />
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <button
              className="text-orange-600 hover:underline"
              onClick={() => navigate('/login')}
            >
              Já tem uma conta? Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 