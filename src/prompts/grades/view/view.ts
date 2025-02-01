import ora from 'ora'

import { Classroom } from '@/api/classroom/classroom.js'
import { Assignments } from '@/api/assignment/assignment.js'
import { select } from '@/utils/prompts/prompts.js'
import { viewGrade } from '@/utils/grade/view/view.js'
import { getGrades } from '@/utils/grade/grade.js'

export async function viewGradePrompt(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await getGrades(classroom)
    spinner.stop()

    const grade = await select({
        message: `${classroom.name} > ${assignment.title} > Select a grade to view`,
        choices: grades.map((grade) => ({
            name: grade.name,
            value: grade,
        })),
        noOptionsMessage: `No grades exist for ${classroom.name} > ${assignment.title}`,
    })

    if (!grade) {
        return
    }

    viewGrade(grade, assignment, classroom)
}
