import { getAccessToken } from './auth.js'
import { Octokit } from 'octokit'
import { headers } from './octokit.js'

export async function listClassrooms() {
    const accessToken = getAccessToken()

    const octokit = new Octokit({ auth: accessToken })

    const classrooms = (await octokit.request('GET /classrooms', { headers: headers })).data

    console.log(classrooms)
}
