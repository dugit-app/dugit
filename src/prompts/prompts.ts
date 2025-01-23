import { select, Separator } from '@inquirer/prompts'

import { grades } from './grades/grades.js'
import { tas } from './tas/tas.js'
import { logout } from './logout/logout.js'

export async function prompts() {
    const option = await select(
        {
            choices: [
                { name: 'Manage grades', value: 'grades' },
                { name: 'Manage teaching assistants', value: 'tas' },
                { name: 'Manage repositories', value: 'repos' },
                new Separator(),
                { name: 'Usage instructions', value: 'usage' },
                { name: 'Logout', value: 'logout' },
                { name: 'Exit', value: 'exit' },
            ],
            message: '',
        },
        { clearPromptOnDone: true },
    )

    switch (option) {
        case 'grades': {
            await grades()
            break
        }

        case 'tas': {
            await tas()
            break
        }

        case 'repos': {
            break
        }

        case 'usage': {
            break
        }

        case 'logout': {
            await logout()
            break
        }

        case 'exit': {
            break
        }
    }
}
