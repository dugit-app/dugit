import ora from 'ora'

import { Grader } from '@/utils/grader/grader.js'
import { Classroom } from '@/api/classroom/classroom.js'
import { ConfigRepo } from '@/utils/config/repo/repo.js'
import { getUser } from '@/api/user/user.js'
import { RequestError } from 'octokit'
import { getRepoFile, updateRepoFile } from '@/api/repo/repo.js'

export async function editGrader(previousGrader: Grader, newGrader: Grader, classroom: Classroom) {
    const spinner = ora(`Updating ${previousGrader.name} in ${classroom.name}`).start()
    const org = classroom.organization.login

    const configFile: ConfigRepo = await getRepoFile(org, 'config.json', 'dugit-config')

    const configGrader = configFile.graders.find(t => t.username === previousGrader.username)

    if (!configGrader) {
        spinner.fail(`Grader with username ${previousGrader.username} does not exist in ${classroom.name}`)
        return
    }

    try {
        await getUser(newGrader.username)
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            spinner.fail(`GitHub user with the username ${newGrader.username} does not exist`)
            return
        }

        console.log(error)
    }

    configGrader.name = newGrader.name
    configGrader.username = newGrader.username

    await updateRepoFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Update ${newGrader.name} in ${classroom.name}`)

    spinner.succeed(`Updated ${newGrader.name} in ${classroom.name}`)
}
