import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { addGrade } from '@/utils/grade/add/add.js'
import { confirm, input } from '@/utils/prompts/prompts.js'
import chalk from 'chalk'

export async function addGradePrompt(assignment: Assignments[number], classroom: Classroom) {
    const name = await input('Enter a name for the grade')

    const confirmAdd = await confirm(`Are you sure you want to add ${name} to ${classroom.name} > ${assignment.title}?`)

    if (confirmAdd) {
        await addGrade(name, assignment, classroom)
    } else {
        console.log(chalk.yellow(`Cancelled adding ${name} to ${classroom.name} > ${assignment.title}`))
    }
}
