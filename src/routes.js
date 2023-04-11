import { randomUUID } from 'node:crypto'
import { Database } from "./database.js";
import { buildRoutePath } from './utils/build-route-path.js'
import { dateFormatter } from './utils/dateFormatter.js'



const database = new Database()


export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) =>{

            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: async (req, res) =>{

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: '',
                created_at: dateFormatter.format(new Date()),
                updated_at: '',
            }

            if(task.title && task.description){
                database.insert('tasks', task)

                return res.writeHead(201).end('')
            }
            
            return res.writeHead(400).end(JSON.stringify({ message: 'title and description are required' }))

        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) =>{

            const { id } = req.params
            const { title, description } = req.body

            const [tasks] = database.select('tasks', { id })

            if(!tasks){
                return res.writeHead(400).end(JSON.stringify({ message: 'id not found' }))
            }
      
            database.update('tasks', id, {
              title,
              description,
              updated_at: new Date()
            })
      
            return res.writeHead(204).end()

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler:(req, res) =>{
            
            const { id } = req.params

            const [tasks] = database.select('tasks', { id })

            if(!tasks){
                return res.writeHead(400).end(JSON.stringify({ message: 'id not found' }))
            }

            database.setCompleted('tasks', {id})

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) =>{

            const { id } = req.params

            const [tasks] = database.select('tasks', { id })

            if(!tasks){
                return res.writeHead(400).end(JSON.stringify({ message: 'id not found' }))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end('')
        }
    },
]