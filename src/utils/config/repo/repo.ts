import { createRepo, createRepoFile, getRepoFile, repoExists, updateRepoFile } from '@/api/repo/repo.js'
import { Grade } from '@/utils/grade/grade.js'
import { Grader } from '@/utils/grader/grader.js'
import ora from 'ora'

export type ConfigRepo = {
    graders: Grader[],
    grades: Grade[]
}

export const defaultConfigRepo: ConfigRepo = { graders: [], grades: [] }

export async function getConfigRepo(org: string) {
    if (await repoExists(org, 'dugit-config')) {
        const configFile: ConfigRepo = await getRepoFile(org, 'config.json', 'dugit-config')

        return configFile
    }

    const spinner = ora(`Creating Dugit config repository for ${org}`).start()
    await createRepo('dugit-config', org)

    spinner.text = 'Uploading config file'
    await createRepoFile(
        org,
        'config.json',
        'dugit-config',
        JSON.stringify(defaultConfigRepo, null, 2),
        'Initial commit',
    )

    spinner.succeed(`Created Dugit config repository for ${org}`)
    return defaultConfigRepo
}

export async function updateConfigRepo(org: string, configRepo: ConfigRepo, message: string) {
    await updateRepoFile(org, 'config.json', 'dugit-config', JSON.stringify(configRepo, null, 2), message)
}
