import { Octokit } from 'octokit'
import utils from '@/utils/utils.js'

export const headers = {
    'X-GitHub-Api-Version': '2022-11-28'
}

export async function newOctokit() {
    return new Octokit({ auth: await utils.auth.getAccessToken() })
}
