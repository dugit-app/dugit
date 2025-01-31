import { headers, newOctokit } from '@/api/octokit.js'
import { Endpoints } from '@octokit/types'

export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data']
export type Repos = Endpoints['GET /orgs/{org}/repos']['response']['data']

export async function createRepo(name: string, org: string): Promise<Repo> {
    const octokit = await newOctokit()

    return (await octokit.request('POST /orgs/{org}/repos', {
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        headers,
        name,
        org,
        private: true,
    })).data
}

export async function addRepoCollaborator(org: string, repo: string, username: string, permission: string) {
    const octokit = await newOctokit()

    return (await octokit.request('PUT /repos/{org}/{repo}/collaborators/{username}', {
        headers,
        org,
        permission,
        repo,
        username,
    })).data
}

export async function getRepoPermission(owner: string, repo: string, username: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}/permission', {
        headers,
        owner,
        repo,
        username,
    })).data.permission
}

export async function getRepo(owner: string, repo: string): Promise<Repo> {
    const octokit = await newOctokit()

    return (await octokit.request('GET /repos/{owner}/{repo}', {
        headers,
        owner,
        repo,
    })).data
}

export async function getRepoFile(owner: string, path: string, repo: string) {
    const octokit = await newOctokit()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return JSON.parse((await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        headers: { ...headers, accept: 'application/vnd.github.raw+json' },
        owner,
        path,
        repo,
    })).data)
}

export async function createRepoFile(owner: string, path: string, repo: string, content: string, message: string) {
    const octokit = await newOctokit()

    return (await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        headers: { ...headers, accept: 'application/vnd.github.raw+json' },
        committer: {
            name: 'dugit',
            email: 'user@example.com',
        },
        message,
        owner,
        path,
        repo,
        content: btoa(content),
    })).data
}

export async function updateRepoFile(owner: string, path: string, repo: string, content: string, message: string) {
    const octokit = await newOctokit()

    const fileData: any = (await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        headers: { ...headers },
        owner,
        path,
        repo,
    })).data

    const sha: string = fileData.sha

    return (await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        headers: { ...headers, accept: 'application/vnd.github.raw+json' },
        committer: {
            name: 'dugit',
            email: 'user@example.com',
        },
        message,
        sha,
        owner,
        path,
        repo,
        content: btoa(content),
    })).data
}

export async function getRepos(org: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /orgs/{org}/repos', { headers, org: org })).data
}

export async function deleteRepo(owner: string, repo: string) {
    const octokit = await newOctokit()

    return (await octokit.request('DELETE /repos/{owner}/{repo}', { headers, owner, repo })).data
}
