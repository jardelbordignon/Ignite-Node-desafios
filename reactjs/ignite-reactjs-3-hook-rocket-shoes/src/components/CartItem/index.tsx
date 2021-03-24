import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { formatPrice } from '../../util/format';

import { IProduct } from '../../pages/Cart';

interface ICartItem {
  product: IProduct;
  onProductDecrement: (product: IProduct) => void;
  onProductIncrement: (product: IProduct) => void;
  onRemoveProduct: (productId: number) => void;
}

export const CartItem = ({
  product,
  onProductDecrement,
  onProductIncrement,
  onRemoveProduct,
}: ICartItem): JSX.Element => {
  const { id, title, price, amount } = product;

  return (
    <tr data-testid="product">
      <td>
        <img
          src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
          alt="Tênis de Caminhada Leve Confortável"
        />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{formatPrice(price)}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={() => onProductDecrement(product)}>
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={() => onProductIncrement(product)}>
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{formatPrice(amount * price)}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => onRemoveProduct(id)}>
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  );
};
