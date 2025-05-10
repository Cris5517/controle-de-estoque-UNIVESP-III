import React, { useMemo } from 'react';
import { Package, Users, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import { useInventory, Product } from '../context/InventoryContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { products, suppliers, getLowStockProducts } = useInventory();
  
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const lowStockProducts = getLowStockProducts();
  const lowStockCount = lowStockProducts.length;
  
  const totalInventoryValue = useMemo(() => {
    return products.reduce((total, product) => {
      return total + (product.price * product.stockQuantity);
    }, 0);
  }, [products]);

  const getStockLevelColor = (product: Product) => {
    const ratio = product.stockQuantity / product.minimumStock;
    if (ratio <= 0.5) return 'text-red-600';
    if (ratio <= 1) return 'text-orange-500';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <div className="flex space-x-2">
          <Link to="/products/new">
            <Button variant="primary" size="sm">
              Novo Produto
            </Button>
          </Link>
          <Link to="/suppliers/new">
            <Button variant="outline" size="sm">
              Novo Fornecedor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-lg text-white">
              <Package size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg text-white">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fornecedores</p>
              <p className="text-2xl font-bold text-gray-800">{totalSuppliers}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-lg text-white">
              <AlertTriangle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockCount}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg text-white">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor do Estoque</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {totalInventoryValue.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Produtos com Estoque Baixo" className="h-full">
          {lowStockProducts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">Mínimo: {product.minimumStock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getStockLevelColor(product)}`}>
                        {product.stockQuantity}
                      </p>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhum produto com estoque baixo</p>
            </div>
          )}
        </Card>

        <Card title="Últimas Atualizações de Estoque" className="h-full">
          <div className="divide-y divide-gray-200">
            {products
              .sort((a, b) => new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime())
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Estoque: {product.stockQuantity} {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span className="text-xs">{formatDate(product.lastRestocked)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;