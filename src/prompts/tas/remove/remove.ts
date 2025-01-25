import { select, confirm } from '@inquirer/prompts'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'

export default async function remove(classroom: Classroom) {
    const ta = await select(
        {
            choices: (await utils.tas.get(classroom)).map((ta) => ({
                name: ta.name,
                value: ta,
            })),
            message: 'Select a teaching assistant',
        },
        { clearPromptOnDone: true },
    )

    const confirmRemove = await confirm({ message: `Are you sure you want to remove ${ta.name} from ${classroom.name}?` }, { clearPromptOnDone: true })

    if (confirmRemove) {
        await utils.tas.remove(ta, classroom)
    }
}
