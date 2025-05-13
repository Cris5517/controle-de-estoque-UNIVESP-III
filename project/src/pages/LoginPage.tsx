import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Coffee size={48} className="text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
            <p className="text-gray-600 mt-2">Entre para acessar o sistema</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
              fullWidth
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              fullWidth
            />

            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                icon={<KeyRound size={18} />}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              className="text-orange-600 hover:underline text-sm"
              onClick={() => navigate('/register')}
            >
              Não tem uma conta? Cadastre-se
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Contas para demonstração:</p>
            <p className="mt-1">
              <strong>Admin:</strong> admin@pastry.com / password
            </p>
            <p>
              <strong>Funcionário:</strong> staff@pastry.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;