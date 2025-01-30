import { headers, newOctokit } from '@/api/octokit.js'

export async function getUser(username: string) {
    const octokit = await newOctokit()

    return (await octokit.request('GET /users/{username}', {
        username,
        headers,
    })).data
}
