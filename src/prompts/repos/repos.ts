import { getOrganizations } from '@/api/org/org.js'
import { removeRepoPrompt } from '@/prompts/repos/remove/remove.js'
import { isAppInstalledOrg } from '@/utils/classroom/classroom.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export async function repos() {
    const spinner = ora().start()
    const orgs = await getOrganizations()
    spinner.stop()

    const org = await select(
        {
            message: 'Select an organization',
            choices: orgs.map((org) => ({
                name: org.login,
                value: org,
            })),
            noOptionsMessage: 'No organizations exist',
        },
    )

    spinner.start()

    if (!org || !await isAppInstalledOrg(org)) {
        spinner.stop()
        return
    }

    spinner.stop()

    const option = await select(
        {
            message: 'Select an option',
            choices: [
                { name: 'Select repositories to delete', value: 'remove' },
            ],
        },
    )

    if (!option) {
        return
    }

    switch (option) {
        case 'remove': {
            await removeRepoPrompt(org)
            break
        }
    }
}
