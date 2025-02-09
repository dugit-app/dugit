import { AcceptedAssignments } from '@/api/assignment/assignment.js'
import { getOrganizationMembership } from '@/api/org/org.js'
import { Grade } from '@/utils/grade/grade.js'
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator'

function generateAnonymousName() {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-' })
}

export class AnonymousNameGenerator {
    private anonymousNamesMap: Grade['anonymousNamesMap'] = []

    async add(acceptedAssignment: AcceptedAssignments[number], org: string) {
        const studentUsernames = acceptedAssignment.students.map(student => student.login)

        let isAdmin = true

        for (const username of studentUsernames) {
            const orgMembership = await getOrganizationMembership(org, username)

            isAdmin = isAdmin && orgMembership == 'admin'
        }

        if (isAdmin) {
            return
        }

        const studentName = acceptedAssignment.students.map(student => student.login).join(', ')
        let anonymousName = generateAnonymousName()

        while (this.anonymousNamesMap.map(n => n.anonymousName).includes(anonymousName)) {
            anonymousName = generateAnonymousName()
        }

        const studentRepoLink = acceptedAssignment.repository.html_url
        const anonymousNameMap = { studentRepoLink, studentName, studentUsernames, anonymousName }
        this.anonymousNamesMap.push(anonymousNameMap)
    }

    getAnonymousNamesMap() {
        return this.anonymousNamesMap
    }
}
