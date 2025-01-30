import { confirm } from '@/utils/prompts/prompts.js'
import { Classroom } from '@/api/classroom.js'
import utils from '@/utils/utils.js'
import { Assignments } from '@/api/assignment.js'
import { select } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export default async function remove(assignment: Assignments[number], classroom: Classroom) {
    const spinner = ora().start()
    const grades = await utils.grades.get(classroom)
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
        await utils.grades.remove(grade.name, assignment, classroom)
    }
}
