import { Separator } from '@inquirer/prompts'
import { ExitPromptError } from '@inquirer/core'

import grades from '@/prompts/grades/grades.js'
import graders from '@/prompts/graders/graders.js'
import logout from '@/prompts/logout/logout.js'
import { select } from '@/utils/prompts/prompts.js'
import repos from '@/prompts/repos/repos.js'
import { help } from '@/prompts/help/help.js'

export default {
    prompts,
    grades,
    graders,
    logout,
}

async function prompts() {
    try {
        const option = await select(
            {
                message: 'Select an option',
                choices: [
                    { name: 'Manage grades', value: 'grades' },
                    { name: 'Manage graders', value: 'graders' },
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

            case 'graders': {
                await graders()
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
