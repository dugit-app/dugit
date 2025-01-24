import { Separator, select } from '@inquirer/prompts'

import { prompts } from '@/prompts/prompts.js'
import api from '@/api/api.js'

export async function tas() {
    const option = await select(
        {
            choices: [
                { name: 'Add TA', value: 'add' },
                { name: 'Edit TA', value: 'edit' },
                { name: 'Remove TA', value: 'remove' },
                new Separator(),
                { name: 'Back', value: 'back' },
            ],
            message: '',
        },
        { clearPromptOnDone: true },
    )

    if (option == 'back') {
        await prompts()
        return
    }

    const classroom = await select(
        {
            choices: (await api.getClassrooms()).map((classroom) => ({
                name: classroom.name,
                value: classroom,
            })),
            message: 'Select an organization',
        },
        { clearPromptOnDone: true },
    )

    switch (option) {
        case 'add': {
            console.log(`Add TA for classroom ${classroom.name}`)
            break
        }

        case 'edit': {
            break
        }

        case 'remove': {
            break
        }
    }
}
