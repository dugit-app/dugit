import { confirm } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { select } from '@/utils/prompts/prompts.js'

export default async function remove(classroom: Classroom) {
    const grader = await select(
        {
            message: 'Select a grader to remove',
            choices: (await utils.graders.get(classroom)).map((grader) => ({
                name: grader.name,
                value: grader,
            })),
            noOptionsMessage: `No graders exist for ${classroom.name}`
        },
    )

    if (!grader) {
        return
    }

    const confirmRemove = await confirm(`Are you sure you want to remove ${grader.name} from ${classroom.name}?`)

    if (confirmRemove) {
        await utils.graders.remove(grader, classroom)
    }
}
