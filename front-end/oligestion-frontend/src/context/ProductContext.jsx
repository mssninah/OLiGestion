import { createContext, useContext, useMemo, useState } from "react";
import { initialProducts } from "../data/mockProducts";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: crypto.randomUUID() }]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) => prev.map((prod) => (prod.id === productId ? { ...prod, ...updates } : prod)));
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
  };

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);

