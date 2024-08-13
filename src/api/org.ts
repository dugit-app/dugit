import { Octokit } from 'octokit'

import { getAccessToken } from '../utils/auth.js'
import { headers } from '../utils/octokit.js'

export async function addOrganizationMember(org: string, username: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('PUT /orgs/{org}/memberships/{username}', {
        headers,
        org,
        role: 'member',
        username,
    })).data
}

export async function getOrganizations() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /user/orgs', { headers })).data
}

export async function getRepositories(organizationName: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /orgs/{org}/repos', { headers, org: organizationName })).data
}

export async function deleteRepository(owner: string, repo: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('DELETE /repos/{owner}/{repo}', { headers, owner, repo })).data
}
