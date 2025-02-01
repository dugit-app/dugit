import ora from 'ora'

import { confirm, select } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { removeGrader } from '@/utils/grader/remove/remove.js'

import { getGraders } from '@/utils/grader/grader.js'

export async function removeGraderPrompt(classroom: Classroom) {
    const spinner = ora().start()
    const graders = await getGraders(classroom)
    spinner.stop()

    const grader = await select(
        {
            message: `${classroom.name} > Select a grader to remove`,
            choices: graders.map((grader) => ({
                name: grader.name,
                value: grader,
            })),
            noOptionsMessage: `No graders exist for ${classroom.name}`,
        },
    )

    if (!grader) {
        return
    }

    const confirmRemove = await confirm(`Are you sure you want to remove ${grader.name} from ${classroom.name}?`)

    if (confirmRemove) {
        await removeGrader(grader, classroom)
    }
}
