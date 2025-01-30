import slug from 'slug'
import { Ora } from 'ora'

import { Assignments } from '@/api/assignment.js'
import api from '@/api/api.js'
import { grantGraderPermissions } from '@/utils/grades/add/repo/repo.js'
import { Classroom } from '@/api/classroom.js'
import { createRepoFile } from '@/api/repo.js'

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

    const repo = await api.createRepo(repoName, org)

    await createRepoFile(org, 'README.md', repoName, readme, 'Initial commit')

    await grantGraderPermissions(repo.name, org, classroom, spinner)
}
