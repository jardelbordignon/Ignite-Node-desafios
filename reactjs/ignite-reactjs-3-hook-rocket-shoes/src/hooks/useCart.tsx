import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    return storagedCart ? JSON.parse(storagedCart) : []
  });

  const saveCart = (cartItems: Product[]) => {
    setCart(cartItems)
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartItems))
    toast('Adicionado com sucesso')
  }

  const addProduct = async (productId: number) => {
    try {
      const { data: stock } = await api.get<Stock>(`/stock/${productId}`)
      if (stock.amount <= 0) {
        toast.error('Erro na adição do produto');
        return;
      }

      const productInCart = cart.find(product => product.id === productId)

      if (productInCart) {        
        if (productInCart.amount + 1 > stock.amount) {
          toast.error('Quantidade solicitada fora de estoque')
          return;
        }
        
        const updateCart = cart.map(product => product.id === productId ?
          {...product, amount: productInCart.amount + 1} : product
        )

        saveCart(updateCart)
      } else {
        const { data: product } = await api.get<Product>(`/products/${productId}`)
        saveCart([...cart, {...product, amount: 1}])
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productExists = cart.some(product => product.id === productId)
      if (!productExists) {
        toast.error('Erro na remoção do produto')
        return
      }

      saveCart(cart.filter(product => product.id !== productId))
    } catch {
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({ productId, amount }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      const stockResponse = await api.get<Stock>(`/stock/${productId}`)
      const isNotAvailableStockQuantity = amount > stockResponse.data.amount
      if (isNotAvailableStockQuantity) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      const updateCart = cart.map(product => product.id === productId ?
        {...product, amount} : product
      )

      saveCart(updateCart)
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
