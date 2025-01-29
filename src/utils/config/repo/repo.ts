import ora from 'ora'

import { Grader } from '@/utils/graders/graders.js'
import api from '@/api/api.js'
import { Grade } from '@/utils/grades/grades.js'
import { repoExists } from '@/utils/repos/repos.js'

export type ConfigRepo = {
    graders: Grader[],
    grades: Grade[]
}

export const defaultConfigRepo: ConfigRepo = { graders: [], grades: [] }

export async function getConfigRepo(org: string) {
    if (await repoExists(org, 'dugit-config')) {
        const configFile: ConfigRepo = await api.getRepoFile(org, 'config.json', 'dugit-config')

        return configFile
    }

    const spinner = ora(`Creating Dugit config repository for ${org}`).start()
    await api.createRepo('dugit-config', org)

    spinner.text = 'Uploading config file'
    await api.createRepoFile(
        org,
        'config.json',
        'dugit-config',
        JSON.stringify(defaultConfigRepo, null, 2),
        'Initial commit'
    )

    spinner.succeed(`Created Dugit config repository for ${org}`)
    return defaultConfigRepo
}

export async function updateConfigRepo(org: string, configRepo: ConfigRepo, message: string) {
    await api.updateRepoFile(org, 'config.json', 'dugit-config', JSON.stringify(configRepo, null, 2), message)
}
