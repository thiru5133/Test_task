import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import express from 'express'


const app = express()
app.use(express.json())


let tasks = [];
const statuses = ['Pending', 'Completed']


//Create Task 
app.post('/', (req, res) => {

  try {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Missing Field' })
    }

    if (!statuses.includes(status)) {
      return res.status(500).json({ message: 'Status inValid' })
    }
    const newTask = { id: uuidv4(), title, description, status };
    tasks.push(newTask);
    res.status(200).json(newTask)
  } catch (error) {
    res.status(500).json({ error: "Task Posting Failed" })
  }

})

//Get All tasks 

app.get('/tasks', (req, res) => {
  try {
    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({ message: "Error Retriving Task" })
  }
})

//Get Particular Task By using Id
app.get('/task/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return res.status(400).json({ error: 'Task Not Found' })
    }

    res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: "Error Retriving Task" })
  }
})


// Updating Task From Tasks By using Id
app.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    if (!statuses.includes(status)) {
      return res.status(500).json({ message: 'Status inValid' })
    }
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task Not Found' })
    }
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (status !== undefined) tasks[taskIndex].status = status;
    res.status(200).json(tasks[taskIndex])
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//Removing Task From Tasks By using Id
app.delete('/task/:id', (req, res) => {
  try {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== id);

    res.status(200).json({ message: "Task Deleted Successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Error Deleting Task" })
  }
})
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server Running on Port ${PORT}`)
})

