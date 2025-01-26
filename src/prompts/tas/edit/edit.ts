import { input } from '@/utils/prompts/prompts.js'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { select } from '@/utils/prompts/prompts.js'

export default async function edit(classroom: Classroom) {
    const previousTa = await select(
        {
            message: 'Select a teaching assistant to edit',
            choices: (await utils.tas.get(classroom)).map((ta) => ({
                name: ta.name,
                value: ta,
            })),
            noOptionsMessage: `No teaching assistants exist for ${classroom.name}`,
        },
    )

    if (!previousTa) {
        return
    }

    const name = await input('Update the teaching assistant\'s name', previousTa.name)
    const username = await input('Update the teaching assistant\'s GitHub username', previousTa.username)

    const newTa = {
        name,
        username,
    }

    await utils.tas.edit(previousTa, newTa, classroom)
}
