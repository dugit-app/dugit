import { headers, newConnection } from '@/api/api.js'
import { Endpoints } from '@octokit/types'

export type Classrooms = Endpoints['GET /classrooms']['response']['data']

export async function getClassrooms(): Promise<Classrooms> {
    const connection = await newConnection()

    return (await connection.request('GET /classrooms', { headers })).data
}

export type Classroom = Endpoints['GET /classrooms/{classroom_id}']['response']['data']

export async function getClassroom(classroomID: number): Promise<Classroom> {
    const connection = await newConnection()

    return (await connection.request('GET /classrooms/{classroom_id}', {
        'classroom_id': classroomID,
        headers,
    })).data
}
