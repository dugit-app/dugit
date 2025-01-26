import { Separator } from '@inquirer/prompts'

import { select } from '@/utils/prompts/prompts.js'
import { isAppInstalledOrg } from '@/prompts/classroom/classroom.js'
import { getOrganizations } from '@/api/org.js'
import remove from '@/prompts/repos/remove/remove.js'

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

    const org = await select(
        {
            message: 'Select an organization',
            choices: (await getOrganizations()).map((org) => ({
                name: org.login,
                value: org,
            })),
            noOptionsMessage: 'No organizations exist',
        },
    )

    if (!org || !await isAppInstalledOrg(org)) {
        return
    }

    switch (option) {
        case 'remove': {
            await remove(org)
            break
        }
    }

    await repos()
}
