import { Assignments } from '@/api/assignment/assignment.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { createRepo } from '@/api/repo/repo.js'
import { tokenizeURL } from '@/utils/auth/auth.js'
import { configDirectoryPath } from '@/utils/config/config.js'
import { grantGraderPermissions, grantStudentPermissions } from '@/utils/grade/add/repo/repo.js'
import { Grade } from '@/utils/grade/grade.js'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { Ora } from 'ora'
import { simpleGit } from 'simple-git'
import slug from 'slug'

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

        const repo = await createRepo(repoPrefix + anonymousName, org)
        const anonymousRepoLink = repo.html_url

        const repoPath = join(configDirectoryPath, 'repo')
        await rm(repoPath, { force: true, recursive: true })

        const git = simpleGit()
        await git.cwd(configDirectoryPath)

        await git.clone((await tokenizeURL(studentRepoLink)), repoPath)
        await git.cwd(repoPath)

        await git.remote(['set-url', '--push', 'origin', (await tokenizeURL(anonymousRepoLink))])

        const branches = await git.branch(['-r'])

        for await (const branch of branches.all) {
            const branchName = branch.slice(branch.search('/') + 1)
            await git.checkout(branchName)

            await git.addConfig('user.email', 'user@example.com')
            await git.addConfig('user.name', anonymousName)

            await git.rebase(['-r', '--root', '--exec', 'git commit --amend --allow-empty --no-edit --reset-author'])
        }

        await git.push(['origin', '--all'])

        await rm(repoPath, { force: true, recursive: true })

        await grantGraderPermissions(repo.name, org, classroom, spinner)

        for (const username of anonymousNameMap.studentUsernames) {
            await grantStudentPermissions(username, repo.name, org, spinner)
        }
    }
}
