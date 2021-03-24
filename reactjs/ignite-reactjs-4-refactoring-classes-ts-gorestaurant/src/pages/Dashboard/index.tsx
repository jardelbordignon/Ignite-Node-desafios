import { useEffect, useState } from 'react'

import api from '../../services/api'

import { Header } from '../../components/Header'
import { Food, IFoodItem } from '../../components/Food'
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles'

export default function Dashboard() {
  const [foods, setFoods] = useState<IFoodItem[]>([])
  const [editingFood, setEditingFood] = useState<IFoodItem>({} as IFoodItem)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get('/foods')
      .then(response => response.data)
      .then(foods => setFoods(foods))
  }, [])

  async function handleAddFood(food: Omit<IFoodItem, 'id' | 'available'>): Promise<void> {
    const data = { ...food, available: true }

    const response = await api.post('/foods', data);

    setFoods([...foods, response.data]);
    setModalOpen(false)
  }

  async function handleUpdateFood(food: Omit<IFoodItem, 'id' | 'available'>): Promise<void> {
    const data = { ...editingFood, ...food };

    const response = await api.put(`/foods/${editingFood.id}`, data);

    setFoods(
      foods.map(foodItem =>
        foodItem.id === editingFood.id ? { ...response.data } : foodItem,
      )
    )
    setModalOpen(false)
  }


  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    setFoods(foods.filter(food => food.id !== id));
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen )
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: IFoodItem) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
