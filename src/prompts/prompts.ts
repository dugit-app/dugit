import { about } from '@/prompts/about/about.js'
import { graders } from '@/prompts/graders/graders.js'
import { grades } from '@/prompts/grades/grades.js'
import { help } from '@/prompts/help/help.js'
import { logoutPrompt } from '@/prompts/logout/logout.js'
import { repos } from '@/prompts/repos/repos.js'
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
                    { name: 'Manage repositories', value: 'repos' },
                    new Separator(),
                    { name: 'Help', value: 'help' },
                    { name: 'About', value: 'about' },
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

            case 'repos': {
                await repos()
                break
            }

            case 'help': {
                help()
                break
            }

            case 'about': {
                about()
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

        console.log(error)
    }
}
