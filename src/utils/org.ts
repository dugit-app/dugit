import { confirm, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'
import { Octokit } from 'octokit'

import { getAccessToken } from './auth.js'
import { headers } from './octokit.js'

export async function getOrganizations() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /user/orgs', { headers })).data
}

export async function selectOrganization() {
    return select({
        choices: (await getOrganizations()).map(organization => ({
            name: organization.login,
            value: organization,
        })),
        message: 'Select an organization:',
    }, { clearPromptOnDone: true })
}

export async function getRepositories(organizationName: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /orgs/{org}/repos', { headers, org: organizationName })).data
}

export async function selectRepository() {
    const organization = await selectOrganization()

    return select({
        choices: (await getRepositories(organization.login)).map(repository => ({
            name: repository.name,
            value: repository,
        })),
        message: 'Select a repository:',
    }, { clearPromptOnDone: true })
}

export async function deleteRepository(owner: string, repo: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('DELETE /repos/{owner}/{repo}', { headers, owner, repo })).data
}

export async function organizationCommand() {
    const repository = await selectRepository()

    const option = await select({
        choices: ([
            {
                name: 'Delete',
                value: 'delete',
            },
            {
                name: 'Cancel',
                value: 'cancel',
            },
        ]),
        message: 'Select an option:',
    }, { clearPromptOnDone: true })

    switch (option) {
        case 'delete': {
            const doDelete = await confirm({
                default: false,
                message: `Are you sure you want to delete ${repository.full_name}?`
            }, { clearPromptOnDone: true })

            if (doDelete) {
                await deleteRepository(repository.owner.login, repository.name)
            } else {
                console.log('Cancelled')
                exit(0)
            }

            break
        }

        case 'cancel': {
            exit(0)
        }
    }
}
