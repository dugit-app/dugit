import { confirm } from '@inquirer/prompts'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import selectOptions from '@/utils/prompts.js'

export default async function remove(classroom: Classroom) {
    const ta = await selectOptions(
        {
            message: 'Select a teaching assistant to remove',
            choices: (await utils.tas.get(classroom)).map((ta) => ({
                name: ta.name,
                value: ta,
            })),
            noOptionsMessage: `No teaching assistants exist for ${classroom.name}`
        },
    )

    if (!ta) {
        return
    }

    const confirmRemove = await confirm({ message: `Are you sure you want to remove ${ta.name} from ${classroom.name}?` }, { clearPromptOnDone: true })

    if (confirmRemove) {
        await utils.tas.remove(ta, classroom)
    }
}
