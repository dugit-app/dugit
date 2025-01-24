import { headers, newOctokit } from '@/utils/octokit.js'

export async function createRepository(name: string, org: string) {
    const octokit = await newOctokit()

    return (await octokit.request('POST /orgs/{org}/repos', {
        'has_issues': false,
        'has_projects': false,
        'has_wiki': false,
        headers,
        name,
        org,
        'private': true,
    })).data
}

export async function addRepositoryCollaborator(org: string, repo: string, username: string, permission: string) {
    const octokit = await newOctokit()

    return (await octokit.request('PUT /repos/{org}/{repo}/collaborators/{username}', {
        headers,
        org,
        permission,
        repo,
        username,
    })).data
}

export async function getRepositoryFile(owner: string, path: string, repo: string) {
    const octokit = await newOctokit()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return JSON.parse((await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        headers: {...headers, accept: 'application/vnd.github.raw+json'},
        owner,
        path,
        repo,
    })).data)
}
