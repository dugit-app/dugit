import { headers, newOctokit } from '@/api/octokit.js'
import { RequestError } from 'octokit'

export async function addOrganizationMember(org: string, username: string) {
    const octokit = await newOctokit()

    return (await octokit.request('PUT /orgs/{org}/memberships/{username}', {
        headers,
        org,
        role: 'member',
        username,
    })).data
}

export async function getOrganizationMembership(org: string, username: string) {
    const octokit = await newOctokit()

    try {
        return (await octokit.request('GET /orgs/{org}/memberships/{username}', {
            headers,
            org,
            username,
        })).data.role
    } catch (error) {
        if (error instanceof RequestError) {
            return undefined
        }

        console.log(error)
    }
}

export async function getOrganizations() {
    const octokit = await newOctokit()

    return (await octokit.request('GET /user/orgs', { headers })).data
}

export async function getRepositories(organizationName: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /orgs/{org}/repos', { headers, org: organizationName })).data
}

export async function deleteRepository(owner: string, repo: string) {
    const octokit = await newOctokit()

    return (await octokit.request('DELETE /repos/{owner}/{repo}', { headers, owner, repo })).data
}
