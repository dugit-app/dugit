import { headers, newConnection } from '@/api/api.js'

export async function getUser(username: string) {
    const connection = await newConnection()

    return (await connection.request('GET /users/{username}', {
        username,
        headers,
    })).data
}
