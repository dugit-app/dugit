import { Classroom } from '@/api/classroom/classroom.js'
import { getRepoFile, updateRepoFile } from '@/api/repo/repo.js'
import { userExists } from '@/api/user/user.js'
import { ConfigRepo } from '@/utils/config/repo/repo.js'
import { Grader } from '@/utils/grader/grader.js'
import ora from 'ora'

export async function editGrader(previousGrader: Grader, newGrader: Grader, classroom: Classroom) {
    const spinner = ora(`Updating ${previousGrader.name} in ${classroom.name}`).start()
    const org = classroom.organization.login

    const configFile: ConfigRepo = await getRepoFile(org, 'config.json', 'dugit-config')

    const configGrader = configFile.graders.find(t => t.username === previousGrader.username)

    if (!configGrader) {
        spinner.fail(`Grader with username ${previousGrader.username} does not exist in ${classroom.name}`)
        return
    }

    if (!await userExists(newGrader.username)) {
        spinner.fail(`GitHub user with the username ${newGrader.username} does not exist`)
        return
    }

    configGrader.name = newGrader.name
    configGrader.username = newGrader.username

    await updateRepoFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Update ${newGrader.name} in ${classroom.name}`)

    spinner.succeed(`Updated ${newGrader.name} in ${classroom.name}`)
}
