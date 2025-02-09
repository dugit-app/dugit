import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { addGrade } from '@/utils/grade/add/add.js'
import { getGrades } from '@/utils/grade/grade.js'
import { confirm, input } from '@/utils/prompts/prompts.js'
import chalk from 'chalk'
import ora from 'ora'

export async function addGradePrompt(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await getGrades(classroom, assignment)
    spinner.stop()

    let name = undefined

    if (grades.length > 0) {
        name = await input('Enter a name for the grade')
    }

    const confirmAdd = await confirm(`Are you sure you want to add ${name || 'a new grade'} to ${classroom.name} > ${assignment.title}?`)

    if (confirmAdd) {
        await addGrade(assignment, classroom, name)
    } else {
        console.log(chalk.yellow(`Cancelled adding ${name || 'new grade'} to ${classroom.name} > ${assignment.title}`))
    }
}
