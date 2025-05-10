import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useInventory } from '../context/InventoryContext';

interface FormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

const SupplierFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const { addSupplier, updateSupplier, getSupplierById } = useInventory();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode && id) {
      const supplier = getSupplierById(id);
      if (supplier) {
        setFormData({
          name: supplier.name,
          contactName: supplier.contactName,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
        });
      } else {
        navigate('/suppliers');
      }
    }
  }, [isEditMode, id, getSupplierById, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do fornecedor é obrigatório';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Nome do contato é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Número de telefone é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        updateSupplier(id, formData);
      } else {
        addSupplier(formData);
      }
      
      navigate('/suppliers');
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/suppliers')}
          icon={<ArrowLeft size={18} />}
          className="mr-4"
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nome do Fornecedor"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Digite o nome da empresa fornecedora"
                required
              />
              
              <Input
                label="Pessoa de Contato"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                error={errors.contactName}
                placeholder="Digite o nome da pessoa de contato"
                required
              />
              
              <Input
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Digite o endereço do fornecedor"
                required
              />
            </div>
            
            <div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Digite o email de contato"
                required
              />
              
              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="Digite o número de telefone de contato"
                required
              />
              
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  icon={<Save size={18} />}
                >
                  {isSubmitting
                    ? isEditMode
                      ? 'Atualizando...'
                      : 'Criando...'
                    : isEditMode
                      ? 'Atualizar Fornecedor'
                      : 'Criar Fornecedor'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SupplierFormPage;