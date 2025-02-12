import { api } from '@/api/api.js'
import { Endpoints } from '@octokit/types'

export type Assignments = Endpoints['GET /classrooms/{classroom_id}/assignments']['response']['data']

export async function getAssignments(classroomID: number): Promise<Assignments> {
    return (await api.octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
    })).data
}

export type AcceptedAssignments = Endpoints['GET /assignments/{assignment_id}/accepted_assignments']['response']['data']

export async function getAcceptedAssignments(assignmentID: number): Promise<AcceptedAssignments> {
    return (await api.octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
    })).data
}
