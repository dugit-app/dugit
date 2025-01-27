import slug from 'slug'
import { Ora } from 'ora'

import { Assignments } from '@/api/assignment.js'
import api from '@/api/api.js'
import { createRepoFile } from '@/api/repo.js'

export async function generateTeacherRepo(config: {
    name: string,
    assignment: Assignments[number],
    org: string,
    readme: string,
    spinner: Ora
}) {
    const { name, assignment, org, readme, spinner } = config
    const repoName = `${assignment.slug}-${slug(name)}-teacher`
    spinner.text = 'Generating teacher repository'

    const repo = await api.createRepo(repoName, org)
    const repoLink = repo.html_url

    await createRepoFile(org, 'README.md', repoName, readme, 'Initial commit')

    return repoLink
}
