import slug from 'slug'
import { simpleGit } from 'simple-git'
import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { Ora } from 'ora'

import { Assignments } from '@/api/assignment.js'
import { Grade } from '@/utils/grades/grades.js'
import api from '@/api/api.js'
import { configDirectoryPath } from '@/utils/config/config.js'
import utils from '@/utils/utils.js'
import { Classroom } from '@/api/classroom.js'
import { grantTaPermissions } from '@/utils/grades/add/repo/repo.js'

export async function generateAnonymousRepo(config: {
    name: string,
    assignment: Assignments[number],
    classroom: Classroom
    org: string,
    anonymousNamesMap: Grade['anonymousNamesMap'],
    spinner: Ora
}) {
    const { name, assignment, classroom, org, anonymousNamesMap, spinner } = config
    const repoPrefix = `${assignment.slug}-${slug(name)}-`

    for (const anonymousNameMap of anonymousNamesMap) {
        const { studentRepoLink, studentName, anonymousName } = anonymousNameMap
        spinner.text = `Generating anonymous repository for ${studentName}`

        const repo = await api.createRepo(repoPrefix + anonymousName, org)
        const anonymousRepoLink = repo.html_url

        const repoPath = join(configDirectoryPath, 'repo')
        await rm(repoPath, { force: true, recursive: true })

        const git = simpleGit()
        await git.cwd(configDirectoryPath)

        await git.clone((await utils.auth.tokenizeURL(studentRepoLink)), repoPath)
        await git.cwd(repoPath)

        await git.remote(['set-url', '--push', 'origin', (await utils.auth.tokenizeURL(anonymousRepoLink))])

        const branches = await git.branch(['-r'])

        for await (const branch of branches.all) {
            const branchName = branch.slice(branch.search('/') + 1)
            await git.checkout(branchName)

            await git.addConfig('user.email', 'user@example.com')
            await git.addConfig('user.name', anonymousName)

            await git.rebase(['-r', '--root', '--exec', 'git commit --amend --no-edit --reset-author'])
        }

        await git.push(['origin', '--all'])

        await rm(repoPath, { force: true, recursive: true })

        await grantTaPermissions(repo.name, org, classroom)
    }
}
