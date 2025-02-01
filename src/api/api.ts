import { getAccessToken } from '@/utils/auth/auth.js'
import { Octokit } from 'octokit'

export const headers = {
    'X-GitHub-Api-Version': '2022-11-28',
}

export async function newConnection() {
    return new Octokit({ auth: await getAccessToken() })
}
