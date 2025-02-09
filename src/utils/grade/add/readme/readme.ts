import { Assignments } from '@/api/assignment/assignment.js'
import { Grade } from '@/utils/grade/grade.js'
import slug from 'slug'

export function getReadmes(config: {
    name: string,
    assignment: Assignments[number],
    org: string,
    anonymousNamesMap: Grade['anonymousNamesMap'],
}) {
    const { name, assignment, org, anonymousNamesMap } = config
    const repoLinkPrefix = `https://github.com/${org}/${assignment.slug}-${slug(name)}-`

    const header = `${assignment.title} - ${name}\n\n`

    let teacher = '# Teacher - ' + header
    teacher += `[Grader Repository](${repoLinkPrefix}grader)\n\n`
    teacher += '| Student repo | Anonymous repo |\n| - | - |\n'

    let grader = '# Grader - ' + header + '| Anonymous repo |\n| - |\n'

    for (const anonymousNameMap of anonymousNamesMap) {
        const anonymousRepoLink = repoLinkPrefix + anonymousNameMap.anonymousName
        teacher += `| [${anonymousNameMap.studentName}](${anonymousNameMap.studentRepoLink}) `
        teacher += `| [${anonymousNameMap.anonymousName}](${anonymousRepoLink}) |\n`
        grader += `| [${anonymousNameMap.anonymousName}](${anonymousRepoLink}) |\n`
    }

    return { teacher, grader }
}
