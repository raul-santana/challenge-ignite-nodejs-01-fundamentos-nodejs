import fs from 'node:fs/promises'
import { dateFormatter } from './utils/dateFormatter.js'

const databasePath = new URL('../db.json', import.meta.url)

export class Database{
    #database = {}

    constructor(){

        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(()=>{
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search){
        let data = this.#database[table] ?? []

        if(search){
            data = data.filter(row =>{
                return Object.entries(search).some(([key, value])=>{
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
      
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else{
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){

            const { created_at, completed_at } = this.#database[table][rowIndex]

            const updated_at = dateFormatter.format(new Date())


            this.#database[table][rowIndex] = {id, ...data, created_at, completed_at, updated_at}
            this.#persist()

            return res.writeHead(204).end('')

        }
    }

    setCompleted(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            const completed_at = dateFormatter.format(new Date())


            this.#database[table][rowIndex].completed_at = completed_at
            this.#persist()
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

}