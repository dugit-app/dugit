import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export default async function view(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await utils.grades.get(classroom)
    spinner.stop()

    const grade = await select({
        message: 'Select a grade to view',
        choices: grades.map((grade) => ({
            name: grade.name,
            value: grade,
        })),
        noOptionsMessage: `No grades exist for ${assignment.title}`
    })

    if (!grade) {
        return
    }

    utils.grades.view(grade, assignment, classroom)
}
