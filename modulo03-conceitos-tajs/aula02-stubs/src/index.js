import Service from "./service.js"

const data = {
  username: `john.doe-${Date.now()}`,
  password: 'senhasegura'
}

const service = new Service({ filename: './users.ndjson' })

await service.create(data)

const users = await service.read()

console.log(users)