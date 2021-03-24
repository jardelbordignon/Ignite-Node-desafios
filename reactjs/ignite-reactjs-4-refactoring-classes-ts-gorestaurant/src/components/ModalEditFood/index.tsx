import { useRef, useCallback } from 'react'
import { FormHandles } from '@unform/core'
import { FiCheckSquare } from 'react-icons/fi'

import { IFoodItem } from '../Food'
import { Modal } from '../Modal'
import { Input } from '../Input'

import { Form } from './styles'

interface IModalProps {
  isOpen: boolean
  setIsOpen: () => void
  handleUpdateFood: (food: Omit<IFoodItem, 'id' | 'available'>) => void
  editingFood: IFoodItem
}

export const ModalEditFood = (
  { isOpen, setIsOpen, editingFood, handleUpdateFood }: IModalProps) => {
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback(
    async ({ name, image, price, description }: Omit<IFoodItem, 'id' | 'available'>) => {
      handleUpdateFood({ name, image, price, description })
      setIsOpen()
    },
    [handleUpdateFood, setIsOpen]
  )

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  )
}
