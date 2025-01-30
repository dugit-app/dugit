import ora from 'ora'

import { Grader } from '@/utils/graders/graders.js'
import { Classroom } from '@/api/classroom.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { getUser } from '@/api/user.js'
import { RequestError } from 'octokit'

export default async function add(grader: Grader, classroom: Classroom) {
    const spinner = ora(`Adding ${grader.name} to ${classroom.name}`).start()
    const org = classroom.organization.login

    try {
        await getUser(grader.username)
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            spinner.fail(`GitHub user with the username ${grader.username} does not exist`)
            return
        }

        console.log(error)
    }

    const configRepo = await getConfigRepo(org)

    const graderExistsIndex = configRepo.graders.findIndex(t => t.username === grader.username)

    if (graderExistsIndex > -1) {
        spinner.fail(`Grader with the username ${grader.username} already exists in ${classroom.name}`)
        return
    }

    configRepo.graders.push(grader)

    await updateConfigRepo(org, configRepo, `Add ${grader.name}`)
    spinner.succeed(`Added ${grader.name} to ${classroom.name}`)
}
