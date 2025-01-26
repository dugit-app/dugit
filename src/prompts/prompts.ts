import { Separator } from '@inquirer/prompts'
import { ExitPromptError } from '@inquirer/core'

import grades from '@/prompts/grades/grades.js'
import tas from '@/prompts/tas/tas.js'
import logout from '@/prompts/logout/logout.js'
import selectOptions from '@/utils/prompts.js'

export default {
    prompts,
    grades,
    tas,
    logout,
}

async function prompts() {
    try {
        const option = await selectOptions(
            {
                message: 'Select an option',
                choices: [
                    { name: 'Manage grades', value: 'grades' },
                    { name: 'Manage teaching assistants', value: 'tas' },
                    { name: 'Manage repositories', value: 'repos' },
                    new Separator(),
                    { name: 'Usage instructions', value: 'usage' },
                    { name: 'Logout', value: 'logout' },
                    { name: 'Exit', value: 'exit' },
                ],
            },
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
                console.log('Logged out')
                break
            }

            case 'exit': {
                break
            }
        }
    } catch (error) {
        if (error instanceof ExitPromptError) {
            process.exit()
        }

        console.log(error)
    }
}
