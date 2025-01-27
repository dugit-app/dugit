import { Assignments } from '@/api/assignment.js'
import { Grade } from '@/utils/grades/grades.js'
import slug from 'slug'

export function getReadmes(config: {
    name: string,
    assignment: Assignments[number],
    org: string,
    anonymousNamesMap: Grade['anonymousNamesMap'],
}) {
    const repoLinkPrefix = `https://github.com/${config.org}/${config.assignment.slug}-${slug(config.name)}-`

    const header = `${config.assignment.title} - ${config.name}\n\n`

    let teacher = '# Teacher - ' + header
    teacher += `[Grader Repository](${repoLinkPrefix}grader)\n\n`
    teacher += '| Student repo | Anonymous repo |\n| - | - |\n'

    let grader = '# Grader - ' + header + '| Anonymous repo |\n| - |\n'

    for (const anonymousNameMap of config.anonymousNamesMap) {
        const anonymousRepoLink = repoLinkPrefix + anonymousNameMap.anonymousName
        teacher += `| [${anonymousNameMap.studentName}](${anonymousNameMap.studentRepoLink}) `
        teacher += `| [${anonymousNameMap.anonymousName}](${anonymousRepoLink}) |\n`
        grader += `| [${anonymousNameMap.anonymousName}](${anonymousRepoLink}) |\n`
    }

    return { teacher, grader }
}
