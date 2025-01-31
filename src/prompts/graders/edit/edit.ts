import { confirm, input } from '@/utils/prompts/prompts.js'

import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export default async function edit(classroom: Classroom) {
    const spinner = ora().start()
    const graders = await utils.graders.get(classroom)
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
        await utils.graders.edit(previousGrader, { name, username }, classroom)
    }
}
