import { select } from '@inquirer/prompts'
import { Octokit } from 'octokit'

import { getAccessToken } from './auth.js'
import { headers } from './octokit.js'

export async function listClassrooms() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    const classrooms = (await octokit.request('GET /classrooms', { headers })).data

    const selectedClassroom = await select({
        choices: classrooms.map(classroom => ({
            name: classroom.name,
            value: classroom,
        })),
        message: 'Select a classroom',
    })

    console.log(selectedClassroom)
}
