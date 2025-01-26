import { headers, newOctokit } from '@/api/octokit.js'
import { Endpoints } from '@octokit/types'

export type Repository = Endpoints['GET /repos/{owner}/{repo}']['response']['data']

export async function createRepository(name: string, org: string): Promise<Repository> {
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

export async function getRepositoryPermission(owner: string, repo: string, username: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}/permission', {
        headers,
        owner,
        repo,
        username,
    })).data.permission
}

export async function getRepository(owner: string, repo: string): Promise<Repository> {
    const octokit = await newOctokit()

    return (await octokit.request('GET /repos/{owner}/{repo}', {
        headers,
        owner,
        repo,
    })).data
}

export async function getRepositoryFile(owner: string, path: string, repo: string) {
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

export async function createRepositoryFile(owner: string, path: string, repo: string, content: string, message: string) {
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

export async function updateRepositoryFile(owner: string, path: string, repo: string, content: string, message: string) {
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

export async function getRepositories(org: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /orgs/{org}/repos', { headers, org: org })).data
}

export async function deleteRepository(owner: string, repo: string) {
    const octokit = await newOctokit()

    return (await octokit.request('DELETE /repos/{owner}/{repo}', { headers, owner, repo })).data
}
