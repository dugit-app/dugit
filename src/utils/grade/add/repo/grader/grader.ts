import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { createRepo, createRepoFile } from '@/api/repo/repo.js'
import { grantGraderPermissions } from '@/utils/grade/add/repo/repo.js'
import { Ora } from 'ora'
import slug from 'slug'

export async function generateGraderRepo(config: {
    name: string,
    assignment: Assignments[number],
    classroom: Classroom
    org: string,
    readme: string,
    spinner: Ora
}) {
    const { name, assignment, classroom, org, readme, spinner } = config
    const repoName = `${assignment.slug}-${slug(name)}-grader`
    spinner.text = 'Generating grader repository'

    const repo = await createRepo(repoName, org)

    await createRepoFile(org, 'README.md', repoName, readme, 'Initial commit')

    await grantGraderPermissions(repo.name, org, classroom, spinner)
}
