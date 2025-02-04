import { api } from '@/api/api.js'
import { Endpoints } from '@octokit/types'
import { RequestError } from 'octokit'

export type Organizations = Endpoints['GET /user/orgs']['response']['data']

export async function addOrganizationMember(org: string, username: string) {
    return (await api.rest.orgs.setMembershipForUser({
        org,
        role: 'member',
        username,
    })).data
}

export async function getOrganizationMembership(org: string, username: string) {
    try {
        return (await api.rest.orgs.getMembershipForUser({
            org,
            username,
        })).data.role
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return undefined
        }

        throw error
    }
}

export async function getOrganizations() {
    return (await api.rest.orgs.listForAuthenticatedUser()).data
}

export async function getOrganizationAppInstallations(org: string) {
    try {
        return (await api.rest.orgs.listAppInstallations({ org })).data.installations
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return undefined
        }

        throw error
    }
}
