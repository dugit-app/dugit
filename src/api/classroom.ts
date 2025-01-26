import { Endpoints } from '@octokit/types'

import { headers, newOctokit } from '@/api/octokit.js'

export type Classrooms = Endpoints['GET /classrooms']['response']['data']

export async function getClassrooms(): Promise<Classrooms> {
    const octokit = await newOctokit()

    return (await octokit.request('GET /classrooms', { headers })).data
}

export type Classroom = Endpoints['GET /classrooms/{classroom_id}']['response']['data']

export async function getClassroom(classroomID: number): Promise<Classroom> {
    const octokit = await newOctokit()

    return (await octokit.request('GET /classrooms/{classroom_id}', {
        'classroom_id': classroomID,
        headers,
    })).data
}
