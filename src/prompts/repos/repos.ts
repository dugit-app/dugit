import { Separator } from '@inquirer/prompts'

import { select } from '@/utils/prompts/prompts.js'
import { isAppInstalledOrg } from '@/prompts/classroom/classroom.js'
import { getOrganizations } from '@/api/org.js'
import remove from '@/prompts/repos/remove/remove.js'
import ora from 'ora'

export default async function repos() {
    const option = await select(
        {
            message: 'Select an option',
            choices: [
                { name: 'Select repositories to delete', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
        },
    )

    if (option == 'back') {
        return
    }

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

    switch (option) {
        case 'remove': {
            await remove(org)
            break
        }
    }

    await repos()
}
