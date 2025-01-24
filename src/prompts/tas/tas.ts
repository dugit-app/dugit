import { Separator, select } from '@inquirer/prompts'

import prompts from '@/prompts/prompts.js'
import api from '@/api/api.js'
import add from '@/prompts/tas/add/add.js'
import edit from '@/prompts/tas/edit/edit.js'
import remove from '@/prompts/tas/remove/remove.js'

export default async function tas() {
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
        await prompts.prompts()
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
            await add(classroom.id)
            break
        }

        case 'edit': {
            await edit(classroom.id)
            break
        }

        case 'remove': {
            await remove(classroom.id)
            break
        }
    }

    await tas()
}
