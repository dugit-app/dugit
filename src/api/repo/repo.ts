import { api } from '@/api/api.js'
import { Endpoints } from '@octokit/types'
import { RequestError } from 'octokit'

export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data']
export type Repos = Endpoints['GET /orgs/{org}/repos']['response']['data']

export async function createRepo(name: string, org: string): Promise<Repo> {
    return (await (await api()).rest.repos.createInOrg({
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        name,
        org,
        private: true,
    })).data
}

export async function addRepoCollaborator(owner: string, repo: string, username: string, permission: string) {
    return (await (await api()).rest.repos.addCollaborator({
        owner,
        permission,
        repo,
        username,
    })).data
}

export async function getRepoPermission(owner: string, repo: string, username: string) {
    return (await (await api()).rest.repos.getCollaboratorPermissionLevel({
        owner,
        repo,
        username,
    })).data.permission
}

export async function repoExists(owner: string, repo: string) {
    try {
        await (await api()).rest.repos.get({ owner, repo })
        return true
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return false
        }

        throw error
    }
}

export async function getRepoFile(owner: string, path: string, repo: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return JSON.parse((await (await api()).rest.repos.getContent({
        mediaType: { format: 'raw' },
        owner,
        path,
        repo,
    })).data)
}

export async function createRepoFile(owner: string, path: string, repo: string, content: string, message: string) {
    return (await (await api()).rest.repos.createOrUpdateFileContents({
        mediaType: { format: 'raw' },
        committer: { name: 'dugit', email: 'user@example.com' },
        message,
        owner,
        path,
        repo,
        content: btoa(content),
    })).data
}

export async function updateRepoFile(owner: string, path: string, repo: string, content: string, message: string) {
    const fileData: any = (await (await api()).rest.repos.getContent({
        owner,
        path,
        repo,
    })).data

    const sha: string = fileData.sha

    return (await (await api()).rest.repos.createOrUpdateFileContents({
        mediaType: { format: 'raw' },
        committer: { name: 'dugit', email: 'user@example.com' },
        message,
        sha,
        owner,
        path,
        repo,
        content: btoa(content),
    })).data
}

export async function getRepos(org: string) {
    return (await (await api()).rest.repos.listForOrg({ org: org })).data
}

export async function deleteRepo(owner: string, repo: string) {
    return (await (await api()).rest.repos.delete({ owner, repo })).data
}
