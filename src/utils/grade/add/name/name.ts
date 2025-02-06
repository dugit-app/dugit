import { AcceptedAssignments } from '@/api/assignment/assignment.js'
import { Grade } from '@/utils/grade/grade.js'
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator'

function generateAnonymousName() {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-' })
}

export class AnonymousNameGenerator {
    private anonymousNamesMap: Grade['anonymousNamesMap'] = []

    add(acceptedAssignment: AcceptedAssignments[number]) {
        const studentName = acceptedAssignment.students.map(student => student.login).join(', ')
        const studentUsernames = acceptedAssignment.students.map(student => student.login)
        let anonymousName = generateAnonymousName()

        while (this.anonymousNamesMap.map(n => n.anonymousName).includes(anonymousName)) {
            anonymousName = generateAnonymousName()
        }

        const studentRepoLink = acceptedAssignment.repository.html_url
        const anonymousNameMap = { studentRepoLink, studentName, studentUsernames, anonymousName }
        this.anonymousNamesMap.push(anonymousNameMap)

        return anonymousNameMap
    }

    getAnonymousNamesMap() {
        return this.anonymousNamesMap
    }
}
