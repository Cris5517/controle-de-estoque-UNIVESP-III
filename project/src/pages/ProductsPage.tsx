import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Filter, PlusCircle, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useInventory, Product } from '../context/InventoryContext';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, suppliers, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const categories = [
    'Ingredientes',
    'Laticínios',
    'Frutas',
    'Nozes',
    'Temperos',
    'Padaria',
    'Bebidas',
    'Embalagens',
    'Equipamentos',
    'Outros',
  ];

  const units = [
    'kg',
    'g',
    'l',
    'ml',
    'unidade',
    'caixa',
    'pacote',
    'garrafa',
    'lata',
    'saco',
    'dúzia',
  ];

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }

    if (supplierFilter) {
      result = result.filter(product => product.supplierId === supplierFilter);
    }

    if (stockFilter === 'low') {
      result = result.filter(product => product.stockQuantity <= product.minimumStock);
    } else if (stockFilter === 'out') {
      result = result.filter(product => product.stockQuantity === 0);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, supplierFilter, stockFilter]);

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const getStockStatusBadge = (product: Product) => {
    if (product.stockQuantity === 0) {
      return <Badge variant="danger">Sem Estoque</Badge>;
    }
    if (product.stockQuantity <= product.minimumStock) {
      return <Badge variant="warning">Estoque Baixo</Badge>;
    }
    return <Badge variant="success">Em Estoque</Badge>;
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Fornecedor Desconhecido';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Produtos</h1>
        <Button 
          onClick={handleAddProduct} 
          icon={<PlusCircle size={18} />}
        >
          Novo Produto
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={[
                { value: '', label: 'Todas as Categorias' },
                ...categories.map(cat => ({ value: cat, label: cat })),
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              fullWidth={false}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: '', label: 'Todos os Fornecedores' },
                ...suppliers.map(sup => ({ value: sup.id, label: sup.name })),
              ]}
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              fullWidth={false}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: '', label: 'Todo Estoque' },
                { value: 'low', label: 'Estoque Baixo' },
                { value: 'out', label: 'Sem Estoque' },
              ]}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              fullWidth={false}
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </Card>

      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getSupplierName(product.supplierId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stockQuantity} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStockStatusBadge(product)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-6">
              {products.length === 0
                ? "Você ainda não adicionou nenhum produto."
                : "Nenhum produto corresponde aos critérios de pesquisa."}
            </p>
            {products.length === 0 && (
              <Button onClick={handleAddProduct}>Adicionar Primeiro Produto</Button>
            )}
          </div>
        </Card>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Produto"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir "{productToDelete?.name}"? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
};

export default ProductsPage;