import ora from 'ora'

import { confirm, select } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { Assignments } from '@/api/assignment/assignment.js'
import { removeGrade } from '@/utils/grade/remove/remove.js'
import { getGrades } from '@/utils/grade/grade.js'

export async function removeGradePrompt(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await getGrades(classroom)
    spinner.stop()

    const grade = await select({
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

    const confirmRemove = await confirm(`Are you sure you want to permanently delete all anonymous repositories for ${classroom.name} > ${assignment.title} > ${grade.name}?`)

    if (confirmRemove) {
        await removeGrade(grade.name, assignment, classroom)
    }
}
