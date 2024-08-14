import { Endpoints } from '@octokit/types'
import { Octokit } from 'octokit'

import { getAccessToken } from '../utils/auth.js'
import { headers } from '../utils/octokit.js'

export type Assignments = Endpoints['GET /classrooms/{classroom_id}/assignments']['response']['data']

export async function getAssignments(classroomID: number): Promise<Assignments> {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export type AcceptedAssignments = Endpoints['GET /assignments/{assignment_id}/accepted_assignments']['response']['data']

export async function getAcceptedAssignments(assignmentID: number): Promise<AcceptedAssignments> {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data
}
