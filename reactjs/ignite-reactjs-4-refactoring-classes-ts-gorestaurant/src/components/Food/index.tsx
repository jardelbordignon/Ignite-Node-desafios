import { useState } from 'react'
import { FiEdit3, FiTrash } from 'react-icons/fi';
import api from '../../services/api';

import { Container } from './styles'

export interface IFoodItem {
  id: number
  name: string 
  description: string
  price: number
  image: string
  available: boolean
}

interface IFood {
  food: IFoodItem
  handleEditFood: (food: IFoodItem) => void
  handleDelete: (id: number) => {};
}

export function Food({ food, handleEditFood, handleDelete }: IFood) {
  const [isAvailable, setIsAvailable] = useState(food.available)

  const {id, name, description, price, image } = food

  async function toggleAvailable(): Promise<void> {
    await api.put(`/foods/${food.id}`, {...food, available: !isAvailable});
    setIsAvailable(!isAvailable)
  }

  return (
    <Container available={isAvailable}>
      <header>
        <img src={image} alt={name} />
      </header>
      <section className="body">
        <h2>{name}</h2>
        <p>{description}</p>
        <p className="price">
          R$ <b>{price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={() => handleEditFood(food)}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
}
