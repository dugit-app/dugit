import { about } from '@/prompts/settings/about/about.js'
import { hide } from '@/prompts/settings/hide/hide.js'
import { repos } from '@/prompts/settings/repos/repos.js'
import { select } from '@/utils/prompts/prompts.js'

export async function settings() {
    const option = await select(
        {
            message: `Select an option`,
            choices: [
                { name: 'Hide classrooms', value: 'hide' },
                { name: 'Manage repositories', value: 'repos' },
                { name: 'About', value: 'about' },
            ],
        },
    )

    if (!option) {
        return
    }

    switch (option) {
        case 'hide': {
            await hide()
            break
        }

        case 'repos': {
            await repos()
            break
        }

        case 'about': {
            about()
            break
        }
    }
}
