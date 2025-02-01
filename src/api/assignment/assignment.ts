import { Endpoints } from '@octokit/types'

import { headers, newConnection } from '@/api/api.js'

export type Assignments = Endpoints['GET /classrooms/{classroom_id}/assignments']['response']['data']

export async function getAssignments(classroomID: number): Promise<Assignments> {
    const connection = await newConnection()

    return (await connection.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export type AcceptedAssignments = Endpoints['GET /assignments/{assignment_id}/accepted_assignments']['response']['data']

export async function getAcceptedAssignments(assignmentID: number): Promise<AcceptedAssignments> {
    const connection = await newConnection()

    return (await connection.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data
}
