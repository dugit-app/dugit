import { graders } from '@/prompts/graders/graders.js'
import { grades } from '@/prompts/grades/grades.js'
import { help } from '@/prompts/help/help.js'
import { logoutPrompt } from '@/prompts/logout/logout.js'
import { settings } from '@/prompts/settings/settings.js'
import { select } from '@/utils/prompts/prompts.js'
import { ExitPromptError } from '@inquirer/core'
import { Separator } from '@inquirer/prompts'

export async function prompts() {
    try {
        const option = await select(
            {
                message: 'Select an option',
                choices: [
                    { name: 'Manage grades', value: 'grades' },
                    { name: 'Manage graders', value: 'graders' },
                    new Separator(),
                    { name: 'Settings', value: 'settings' },
                    { name: 'Help', value: 'help' },
                    { name: 'Logout', value: 'logout' },
                    { name: 'Exit', value: 'exit' },
                ],
                hideBackOption: true,
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

            case 'settings': {
                await settings()
                break
            }

            case 'help': {
                help()
                break
            }

            case 'logout': {
                await logoutPrompt()
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

        throw error
    }
}
