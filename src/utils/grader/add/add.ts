import { Classroom } from '@/api/classroom/classroom.js'
import { getUser } from '@/api/user/user.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Grader } from '@/utils/grader/grader.js'
import { RequestError } from 'octokit'
import ora from 'ora'

export async function addGrader(grader: Grader, classroom: Classroom) {
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

    await updateConfigRepo(org, configRepo, `Add ${grader.name} to ${classroom.name}`)
    spinner.succeed(`Added ${grader.name} to ${classroom.name}`)
}
