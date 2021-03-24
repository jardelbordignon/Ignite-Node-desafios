import React from 'react';

import { CartItem } from '../../components/CartItem';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

export interface IProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
    ...product, 
    priceFormatted: formatPrice(product.price),
    subTotal: formatPrice(product.price * product.amount)
  }))
  
  const total = formatPrice(cart.reduce((acc, prod) => (acc += prod.price * prod.amount), 0))

  function handleProductIncrement(product: IProduct) {
    updateProductAmount({ productId: product.id, amount: product.amount + 1 })
  }

  function handleProductDecrement(product: IProduct) {
    if (product.amount > 1)
      updateProductAmount({ productId: product.id, amount: product.amount - 1 })
    else
      removeProduct(product.id)
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          { 
            cartFormatted.map(product => (
              <CartItem
                key={product.id}
                product={product}
                onProductIncrement={handleProductIncrement}
                onProductDecrement={handleProductDecrement}
                onRemoveProduct={handleRemoveProduct}
              />
            ))
          }
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{ total }</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
