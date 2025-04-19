
export interface Product {
  name: string;
  quantity: string;
  location: string;
  expiryDate: string;
}

const STORAGE_KEY = 'stock-na-mao-products';

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.name === product.name);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const productsStr = localStorage.getItem(STORAGE_KEY);
  return productsStr ? JSON.parse(productsStr) : [];
};

export const getProductByName = (name: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.name.toLowerCase() === name.toLowerCase());
};

export const deleteProduct = (name: string): boolean => {
  const products = getProducts();
  const initialLength = products.length;
  const filteredProducts = products.filter(p => p.name.toLowerCase() !== name.toLowerCase());
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
  
  return initialLength > filteredProducts.length;
};
