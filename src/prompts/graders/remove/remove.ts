import { confirm } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export default async function remove(classroom: Classroom) {
    const spinner = ora().start()
    const graders = await utils.graders.get(classroom)
    spinner.stop()

    const grader = await select(
        {
            message: 'Select a grader to remove',
            choices: graders.map((grader) => ({
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
