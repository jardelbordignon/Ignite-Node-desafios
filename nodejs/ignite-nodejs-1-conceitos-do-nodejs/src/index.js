const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(404).json({ error: 'User not found'})
  }

	request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const usernameAlreadyRegistered = users.some(user => user.username === username)

  if (usernameAlreadyRegistered) {
    return response.status(400).json({ error: 'Username already registered'})
  }

  const user = {
    id: uuid(),
	  name, 
	  username, 
	  todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.use(checksExistsUserAccount)

app.get('/todos', (request, response) => {
  const { user } = request
  return response.json(user.todos)
});

app.post('/todos', (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', (request, response) => {
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'Todo not found' })
  }

  user.todos[todoIndex].title = title
  user.todos[todoIndex].deadline = deadline


  return response.json(user.todos[todoIndex])
});

app.patch('/todos/:id/done', (request, response) => {
  const { user } = request

  const todoIndex = user.todos.findIndex(todo => todo.id === request.params.id)

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'Todo not found' })
  }

  user.todos[todoIndex].done = true

  return response.json(user.todos[todoIndex])
});

app.delete('/todos/:id', (request, response) => {
  const { user } = request
  const { id } = request.params

  const todoExists = user.todos.some(todo => todo.id === id)

  if (!todoExists) {
    return response.status(404).json({ error: 'Todo not found' })
  }

  const todoList = user.todos.filter(todo => todo.id !== id)

  user.todos = todoList

  return response.status(204).send()
});

module.exports = app;