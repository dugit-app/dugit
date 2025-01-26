import ora from 'ora'

import { TA } from '@/utils/tas/tas.js'
import { Classroom } from '@/api/classroom.js'
import api from '@/api/api.js'
import { ConfigRepo } from '@/utils/configRepo.js'

export default async function edit(previousTa: TA, newTa: TA, classroom: Classroom) {
    const spinner = ora(`Updating ${previousTa.name} in ${classroom.name}`).start()
    const org = classroom.organization.login

    const configFile: ConfigRepo = await api.getRepositoryFile(org, 'config.json', 'dugit-config')

    const configTa = configFile.tas.find(t => t.username === previousTa.username)

    if (!configTa) {
        spinner.fail(`Teaching assistant with username ${previousTa.username} does not exist in ${classroom.name}`)
        return
    }

    configTa.name = newTa.name
    configTa.email = newTa.email
    configTa.username = newTa.username

    await api.updateRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Update ${newTa.name}`)

    spinner.succeed(`Updated ${newTa.name} in ${classroom.name}`)
}
