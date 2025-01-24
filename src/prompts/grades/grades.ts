import { Separator, select } from '@inquirer/prompts'

import { prompts } from '@/prompts/prompts.js'
import api from '@/api/api.js'

export async function grades() {
    const option = await select(
        {
            choices: [
                { name: 'New grade', value: 'new' },
                { name: 'Pull grades from TA repo', value: 'pull' },
                { name: 'Remove grade', value: 'remove' },
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

    const assignment = await select(
        {
            choices: (await api.getAssignments(classroom.id)).map((assignment) => ({
                name: assignment.title,
                value: assignment,
            })),
            message: '',
        },
        { clearPromptOnDone: true },
    )

    switch (option) {
        case 'new': {
            console.log(`New grade for assignment ${assignment.title}`)
            break
        }

        case 'pull': {
            break
        }

        case 'remove': {
            break
        }
    }
}
