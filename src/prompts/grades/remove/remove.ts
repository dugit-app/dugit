import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { getGrades } from '@/utils/grade/grade.js'
import { removeGrade } from '@/utils/grade/remove/remove.js'
import { confirm, select } from '@/utils/prompts/prompts.js'
import chalk from 'chalk'
import ora from 'ora'

export async function removeGradePrompt(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await getGrades(classroom, assignment)
    spinner.stop()

    let grade

    if (grades.length == 1) {
        grade = grades[0]
    } else {
        grade = await select({
            message: `${classroom.name} > ${assignment.title} > Select a grade to remove`,
            choices: grades.map((grade) => ({
                name: grade.name,
                value: grade,
            })),
            noOptionsMessage: `No grades exist for ${classroom.name} > ${assignment.title}`,
        })

        if (!grade) {
            return
        }
    }

    const confirmRemove = await confirm(`Are you sure you want to permanently delete all anonymous repositories for ${classroom.name} > ${assignment.title} > ${grade.name}?`)

    if (confirmRemove) {
        await removeGrade(grade.name, assignment, classroom)
    } else {
        console.log(chalk.yellow(`Cancelled deleting ${classroom.name} > ${assignment.title} > ${grade.name}`))
    }
}
