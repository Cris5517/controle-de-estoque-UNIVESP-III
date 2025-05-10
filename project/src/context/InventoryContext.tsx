import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  price: number;
  stockQuantity: number;
  unit: string;
  category: string;
  minimumStock: number;
  image: string;
  lastRestocked: string;
}

interface InventoryContextType {
  suppliers: Supplier[];
  products: Product[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  deleteSupplier: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'lastRestocked'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id' | 'lastRestocked'>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Moinho Paulista',
    contactName: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao@moinhopaulista.com',
    address: 'Rua das Farinhas, 123 - São Paulo',
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Açúcar & Cia',
    contactName: 'Maria Santos',
    phone: '(11) 91234-5678',
    email: 'maria@acucarecia.com',
    address: 'Av. Doce, 456 - São Paulo',
    createdAt: new Date(2023, 3, 20).toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Farinha de Trigo',
    description: 'Farinha de trigo tipo 1 para pastel',
    supplierId: '1',
    price: 25.99,
    stockQuantity: 45,
    unit: 'kg',
    category: 'Ingredientes',
    minimumStock: 20,
    image: 'https://images.pexels.com/photos/7474260/pexels-photo-7474260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    lastRestocked: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: '2',
    name: 'Açúcar Refinado',
    description: 'Açúcar refinado especial',
    supplierId: '2',
    price: 18.50,
    stockQuantity: 12,
    unit: 'kg',
    category: 'Ingredientes',
    minimumStock: 15,
    image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    lastRestocked: new Date(2023, 4, 25).toISOString(),
  },
  {
    id: '3',
    name: 'Manteiga',
    description: 'Manteiga sem sal para massa',
    supplierId: '2',
    price: 32.75,
    stockQuantity: 28,
    unit: 'kg',
    category: 'Laticínios',
    minimumStock: 10,
    image: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    lastRestocked: new Date(2023, 5, 5).toISOString(),
  },
];

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    return savedSuppliers ? JSON.parse(savedSuppliers) : initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    setSuppliers(
      suppliers.map((s) =>
        s.id === id
          ? { ...s, ...supplier }
          : s
      )
    );
  };

  const deleteSupplier = (id: string) => {
    const hasProducts = products.some(product => product.supplierId === id);
    
    if (hasProducts) {
      throw new Error('Não é possível excluir um fornecedor que possui produtos cadastrados');
    }
    
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id' | 'lastRestocked'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastRestocked: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Omit<Product, 'id' | 'lastRestocked'>) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, ...product, lastRestocked: p.lastRestocked }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, quantity: number) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, stockQuantity: quantity, lastRestocked: new Date().toISOString() }
          : p
      )
    );
  };

  const getSupplierById = (id: string) => {
    return suppliers.find((s) => s.id === id);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter((p) => p.stockQuantity <= p.minimumStock);
  };

  const value = {
    suppliers,
    products,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getSupplierById,
    getProductById,
    getLowStockProducts,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};