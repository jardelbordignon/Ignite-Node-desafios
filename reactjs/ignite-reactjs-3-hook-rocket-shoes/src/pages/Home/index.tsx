import React, { useState, useEffect } from 'react';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { ProductItem } from '../../components/ProductItem';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface FormattedProduct extends Product {
  formattedPrice: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return {...sumAmount, [product.id]: product.amount}
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products')
      const formattedProducts = response.data.map((product: Product) => ({
        ...product, price: formatPrice(product.price)
      }))
      setProducts(formattedProducts)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      { 
        products.map((product: Product) => (
          <ProductItem 
            key={product.id}
            product={product}
            onAddProduct={handleAddProduct}
            amount={cartItemsAmount[product.id] || 0}
          />
        ))
      }
    </ProductList>
  );
};

export default Home;
