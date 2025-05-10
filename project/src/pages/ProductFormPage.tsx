import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useInventory } from '../context/InventoryContext';

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

interface FormData {
  name: string;
  description: string;
  supplierId: string;
  price: string;
  stockQuantity: string;
  unit: string;
  category: string;
  minimumStock: string;
  image: string;
}

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const { suppliers, addProduct, updateProduct, getProductById } = useInventory();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    supplierId: '',
    price: '',
    stockQuantity: '',
    unit: 'kg',
    category: 'Ingredients',
    minimumStock: '',
    image: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode && id) {
      const product = getProductById(id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          supplierId: product.supplierId,
          price: product.price.toString(),
          stockQuantity: product.stockQuantity.toString(),
          unit: product.unit,
          category: product.category,
          minimumStock: product.minimumStock.toString(),
          image: product.image,
        });
      } else {
        navigate('/products');
      }
    }
  }, [isEditMode, id, getProductById, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      newErrors.name = 'Nome do produto é obrigatório';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Fornecedor é obrigatório';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um número positivo';
    }
    
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Quantidade em estoque é obrigatória';
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Quantidade em estoque deve ser um número inteiro não negativo';
    }
    
    if (!formData.minimumStock.trim()) {
      newErrors.minimumStock = 'Estoque mínimo é obrigatório';
    } else if (isNaN(parseInt(formData.minimumStock)) || parseInt(formData.minimumStock) < 0) {
      newErrors.minimumStock = 'Estoque mínimo deve ser um número inteiro não negativo';
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
      const productData = {
        name: formData.name,
        description: formData.description,
        supplierId: formData.supplierId,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        unit: formData.unit,
        category: formData.category,
        minimumStock: parseInt(formData.minimumStock),
        image: formData.image,
      };
      
      if (isEditMode && id) {
        updateProduct(id, productData);
      } else {
        addProduct(productData);
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          icon={<ArrowLeft size={18} />}
          className="mr-4"
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Detalhes do Produto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Produto"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Digite o nome do produto"
                  required
                />
                
                <Select
                  label="Categoria"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  required
                />
              </div>
              
              <Input
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Digite a descrição do produto"
                className="mt-4"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Select
                  label="Fornecedor"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  options={suppliers.map(sup => ({ value: sup.id, label: sup.name }))}
                  error={errors.supplierId}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Preço"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    placeholder="0.00"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Quantidade em Estoque"
                      name="stockQuantity"
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      error={errors.stockQuantity}
                      placeholder="0"
                      required
                    />
                    
                    <Input
                      label="Estoque Mínimo"
                      name="minimumStock"
                      type="number"
                      min="0"
                      value={formData.minimumStock}
                      onChange={handleChange}
                      error={errors.minimumStock}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card title="Image & Inventory">
              <Input
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
              
              {formData.image && (
                <div className="mt-4 rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center">
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                  />
                </div>
              )}
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                icon={<Save size={18} />}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;