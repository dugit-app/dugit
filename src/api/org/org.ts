import { headers, newConnection } from '@/api/api.js'
import { RequestError } from 'octokit'
import { Endpoints } from '@octokit/types'

export type Organizations = Endpoints['GET /user/orgs']['response']['data']

export async function addOrganizationMember(org: string, username: string) {
    const connection = await newConnection()

    return (await connection.request('PUT /orgs/{org}/memberships/{username}', {
        headers,
        org,
        role: 'member',
        username,
    })).data
}

export async function getOrganizationMembership(org: string, username: string) {
    const connection = await newConnection()

    try {
        return (await connection.request('GET /orgs/{org}/memberships/{username}', {
            headers,
            org,
            username,
        })).data.role
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return undefined
        }

        console.log(error)
    }
}

export async function getOrganizations() {
    const connection = await newConnection()

    return (await connection.request('GET /user/orgs', { headers })).data
}

export async function getOrganizationAppInstallations(org: string) {
    const connection = await newConnection()

    try {
        return (await connection.request('GET /orgs/{org}/installations', { headers, org })).data.installations
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return undefined
        }

        console.log(error)
    }
}
