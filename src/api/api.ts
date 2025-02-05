import { getAccessToken } from '@/utils/auth/auth.js'
import { Octokit } from 'octokit'

export async function api() {
    return new Octokit({ auth: await getAccessToken() })
}
