import { Classroom } from '@/api/classroom/classroom.js'
import { addGrader } from '@/utils/grader/add/add.js'
import { confirm, input } from '@/utils/prompts/prompts.js'
import chalk from 'chalk'

export async function addGraderPrompt(classroom: Classroom) {
    const username = await input('Enter the grader\'s GitHub username')
    const name = await input('Enter the grader\'s name')

    const confirmAdd = await confirm(`Are you sure you want to add ${name} to ${classroom.name}?`)

    if (confirmAdd) {
        await addGrader({
            name,
            username,
        }, classroom)
    } else {
        console.log(chalk.yellow(`Cancelled adding ${name} to ${classroom.name}`))
    }
}
