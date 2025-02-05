import { api } from '@/api/api.js'
import { Endpoints } from '@octokit/types'

export type Classrooms = Endpoints['GET /classrooms']['response']['data']

export async function getClassrooms(): Promise<Classrooms> {
    return (await (await api()).request('GET /classrooms')).data
}

export type Classroom = Endpoints['GET /classrooms/{classroom_id}']['response']['data']

export async function getClassroom(classroomID: number): Promise<Classroom> {
    return (await (await api()).request('GET /classrooms/{classroom_id}', {
        'classroom_id': classroomID,
    })).data
}
