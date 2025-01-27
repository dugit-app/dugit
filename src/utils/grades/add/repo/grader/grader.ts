import slug from 'slug'
import { simpleGit } from 'simple-git'
import { join } from 'node:path'
import { rm, writeFile } from 'node:fs/promises'
import { Ora } from 'ora'

import { Assignments } from '@/api/assignment.js'
import api from '@/api/api.js'
import { configDirectoryPath } from '@/utils/config/config.js'
import utils from '@/utils/utils.js'
import { grantTaPermissions } from '@/utils/grades/add/repo/repo.js'
import { Classroom } from '@/api/classroom.js'

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
    const repoLink = repo.html_url

    const repoPath = join(configDirectoryPath, 'repo')
    await rm(repoPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    const instructorURL = await utils.auth.tokenizeURL(repoLink)
    await git.clone(instructorURL, repoPath)

    await git.cwd(repoPath)

    await git.remote(['set-url', 'origin', instructorURL])

    await git.addConfig('user.email', 'user@example.com')
    await git.addConfig('user.name', 'dugit')

    await writeFile(join(repoPath, 'README.md'), readme)
    await git.add('README.md')

    await git.commit('Generate files')
    await git.push(['-u', 'origin', 'main'])

    await rm(repoPath, { force: true, recursive: true })

    await grantTaPermissions(repo.name, org, classroom)
}
