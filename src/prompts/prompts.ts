import { Separator } from '@inquirer/prompts'
import { ExitPromptError } from '@inquirer/core'

import grades from '@/prompts/grades/grades.js'
import tas from '@/prompts/tas/tas.js'
import logout from '@/prompts/logout/logout.js'
import { select } from '@/utils/prompts/prompts.js'
import repos from '@/prompts/repos/repos.js'
import { help } from '@/prompts/help/help.js'

export default {
    prompts,
    grades,
    tas,
    logout,
}

async function prompts() {
    try {
        const option = await select(
            {
                message: 'Select an option',
                choices: [
                    { name: 'Manage grades', value: 'grades' },
                    { name: 'Manage teaching assistants', value: 'tas' },
                    { name: 'Manage repositories', value: 'repos' },
                    new Separator(),
                    { name: 'Help', value: 'help' },
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
                await repos()
                break
            }

            case 'help': {
                help()
                break
            }

            case 'logout': {
                await logout()
                break
            }

            case 'exit': {
                return
            }
        }

        await prompts()
    } catch (error) {
        // Prevent error from printing when exiting manually
        if (error instanceof ExitPromptError) {
            return
        }

        console.log(error)
    }
}
