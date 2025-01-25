import ora from 'ora'

import { TA } from '@/utils/tas/tas.js'
import { getRepository } from '@/api/repository.js'
import { RequestError } from 'octokit'
import api from '@/api/api.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(ta: TA, classroom: Classroom) {
    const spinner = ora(`Adding ${ta.name} to ${classroom.name}`).start()
    const org = classroom.organization.login

    try {
        await getRepository(org, 'dugit-config')
        // ^^^ Checks if the repo exists by throwing an error if it doesn't
        const configFile: { tas: TA[] } = await api.getRepositoryFile(org, 'config.json', 'dugit-config')

        const taExistsIndex = configFile.tas.findIndex(t => t.username === ta.username)

        if (taExistsIndex > -1) {
            configFile.tas.splice(taExistsIndex, 1)
        }

        configFile.tas.push(ta)

        await api.updateRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Add ${ta.name}`)
    } catch (e) {
        if (e instanceof RequestError) {
            spinner.text = 'Creating Dugit config repository'
            await api.createRepository('dugit-config', org)

            spinner.text = 'Uploading config file'
            await api.createRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify({ tas: [ta] }, null, 2), 'Initial commit')
        }
    }

    spinner.succeed(`Added ${ta.name} to ${classroom.name}`)
}
