import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, PlusCircle, Edit, Trash2, Mail, Phone } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useInventory, Supplier } from '../context/InventoryContext';

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const { suppliers, deleteSupplier, products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredSuppliers = suppliers.filter(
    supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    navigate('/suppliers/new');
  };

  const handleEditSupplier = (id: string) => {
    navigate(`/suppliers/edit/${id}`);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setErrorMessage('');
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      try {
        deleteSupplier(supplierToDelete.id);
        setShowDeleteModal(false);
        setSupplierToDelete(null);
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
    }
  };

  const getProductCountForSupplier = (supplierId: string) => {
    return products.filter(product => product.supplierId === supplierId).length;
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Fornecedores</h1>
        <Button 
          onClick={handleAddSupplier} 
          icon={<PlusCircle size={18} />}
        >
          Adicionar Fornecedor
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </div>
        </div>
      </Card>

      {filteredSuppliers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produtos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adicionado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
                          {supplier.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{supplier.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.contactName}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail size={14} />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone size={14} />
                        <span>{supplier.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getProductCountForSupplier(supplier.id)} produtos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(supplier.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditSupplier(supplier.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(supplier)}
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
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-gray-500 mb-6">
              {suppliers.length === 0
                ? "Você ainda não adicionou nenhum fornecedor."
                : "Nenhum fornecedor corresponde aos critérios de pesquisa."}
            </p>
            {suppliers.length === 0 && (
              <Button onClick={handleAddSupplier}>Adicionar Primeiro Fornecedor</Button>
            )}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Fornecedor"
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
        <div>
          <p className="text-gray-700 mb-4">
            Tem certeza que deseja excluir "{supplierToDelete?.name}"? Esta ação não pode ser desfeita.
          </p>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          {supplierToDelete && getProductCountForSupplier(supplierToDelete.id) > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm">
              Este fornecedor possui produtos associados. Você deve excluir ou reatribuir estes produtos antes de excluir este fornecedor.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SuppliersPage;