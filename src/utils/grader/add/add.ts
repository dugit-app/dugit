import { Classroom } from '@/api/classroom/classroom.js'
import { userExists } from '@/api/user/user.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Grader } from '@/utils/grader/grader.js'
import ora from 'ora'

export async function addGrader(grader: Grader, classroom: Classroom) {
    const spinner = ora(`Adding ${grader.name} to ${classroom.name}`).start()
    const org = classroom.organization.login

    if (!await userExists(grader.username)) {
        spinner.fail(`GitHub user with the username ${grader.username} does not exist`)
        return
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
