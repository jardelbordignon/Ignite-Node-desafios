import { MdAddShoppingCart } from 'react-icons/md';
import { Product } from '../../pages/Home';

import { Li } from './styles'

interface IProductItem {
  product: Product
  onAddProduct: (id: number) => void
  amount: number
}

export const ProductItem = ({ product, onAddProduct, amount }: IProductItem): JSX.Element => {
  const {id, image, price, title} = product

  return (
    <Li>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{price}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => onAddProduct(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" /> { amount }
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </Li>
  )
}
