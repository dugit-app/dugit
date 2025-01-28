import ora from 'ora'

import { Grader } from '@/utils/graders/graders.js'
import { Classroom } from '@/api/classroom.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'

export default async function add(grader: Grader, classroom: Classroom) {
    const spinner = ora(`Adding ${grader.name} to ${classroom.name}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const taExistsIndex = configRepo.graders.findIndex(t => t.username === grader.username)

    if (taExistsIndex > -1) {
        configRepo.graders.splice(taExistsIndex, 1)
    }

    configRepo.graders.push(grader)

    await updateConfigRepo(org, configRepo, `Add ${grader.name}`)
    spinner.succeed(`Added ${grader.name} to ${classroom.name}`)
}
