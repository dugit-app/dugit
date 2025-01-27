import ora from 'ora'

import { Grader } from '@/utils/graders/graders.js'
import { Classroom } from '@/api/classroom.js'
import api from '@/api/api.js'
import { ConfigRepo } from '@/utils/config/repo/repo.js'

export default async function edit(previousGrader: Grader, newGrader: Grader, classroom: Classroom) {
    const spinner = ora(`Updating ${previousGrader.name} in ${classroom.name}`).start()
    const org = classroom.organization.login

    const configFile: ConfigRepo = await api.getRepositoryFile(org, 'config.json', 'dugit-config')

    const configGrader = configFile.graders.find(t => t.username === previousGrader.username)

    if (!configGrader) {
        spinner.fail(`Grader with username ${previousGrader.username} does not exist in ${classroom.name}`)
        return
    }

    configGrader.name = newGrader.name
    configGrader.username = newGrader.username

    await api.updateRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Update ${newGrader.name}`)

    spinner.succeed(`Updated ${newGrader.name} in ${classroom.name}`)
}
