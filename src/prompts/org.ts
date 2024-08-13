import { confirm, select } from '@inquirer/prompts'
import { exit } from '@oclif/core/errors'

import { deleteRepository, getOrganizations, getRepositories } from '../api/org.js'

async function selectOrganization() {
    return select({
        choices: (await getOrganizations()).map(organization => ({
            name: organization.login,
            value: organization,
        })),
        message: 'Select an organization',
    }, { clearPromptOnDone: true })
}

async function selectRepository() {
    const organization = await selectOrganization()

    return select({
        choices: (await getRepositories(organization.login)).map(repository => ({
            name: repository.name,
            value: repository,
        })),
        message: 'Select a repository',
    }, { clearPromptOnDone: true })
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
        message: 'Select an option',
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
