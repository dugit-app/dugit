import ora from 'ora'

import { confirm, input, select } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { editGrader } from '@/utils/grader/edit/edit.js'
import { getGraders } from '@/utils/grader/grader.js'

export async function editGraderPrompt(classroom: Classroom) {
    const spinner = ora().start()
    const graders = await getGraders(classroom)
    spinner.stop()

    const previousGrader = await select(
        {
            message: `${classroom.name} > Select a grader to edit`,
            choices: graders.map((grader) => ({
                name: grader.name,
                value: grader,
            })),
            noOptionsMessage: `No graders exist for ${classroom.name}`,
        },
    )

    if (!previousGrader) {
        return
    }

    const name = await input('Update the grader\'s name', previousGrader.name)
    const username = await input('Update the grader\'s GitHub username', previousGrader.username)

    const confirmAdd = await confirm(`Are you sure you want to update ${name} in ${classroom.name}?`)

    if (confirmAdd) {
        await editGrader(previousGrader, { name, username }, classroom)
    }
}
