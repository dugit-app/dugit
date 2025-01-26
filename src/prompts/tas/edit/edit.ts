import { select, input } from '@inquirer/prompts'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'

export default async function edit(classroom: Classroom) {
    const previousTa = await select(
        {
            choices: (await utils.tas.get(classroom)).map((ta) => ({
                name: ta.name,
                value: ta,
            })),
            message: 'Select a teaching assistant to edit',
        },
        { clearPromptOnDone: true },
    )

    const name = await input({
        default: previousTa.name,
        message: 'Update the teaching assistant\'s name',
    }, { clearPromptOnDone: true })
    const email = await input({
        default: previousTa.email,
        message: 'Update the teaching assistant\'s email',
    }, { clearPromptOnDone: true })
    const username = await input({
        default: previousTa.username,
        message: 'Update the teaching assistant\'s GitHub username',
    }, { clearPromptOnDone: true })

    const newTa = {
        name,
        email,
        username,
    }

    await utils.tas.edit(previousTa, newTa, classroom)
}
