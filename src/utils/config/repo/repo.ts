import { Grader } from '@/utils/graders/graders.js'
import { getRepository } from '@/api/repo.js'
import api from '@/api/api.js'
import { RequestError } from 'octokit'
import ora from 'ora'
import { Grade } from '@/utils/grades/grades.js'

export type ConfigRepo = {
    graders: Grader[],
    grades: Grade[]
}

export const defaultConfigRepo: ConfigRepo = { graders: [], grades: [] }

export default async function getConfigRepo(org: string) {
    try {
        await getRepository(org, 'dugit-config')
        // ^^^ Checks if the repo exists by throwing an error if it doesn't
        const configFile: ConfigRepo = await api.getRepositoryFile(org, 'config.json', 'dugit-config')

        return configFile
    } catch (error) {
        if (error instanceof RequestError) {
            const spinner = ora(`Creating Dugit config repository for ${org}`).start()
            await api.createRepository('dugit-config', org)
            spinner.text = 'Uploading config file'
            await api.createRepositoryFile(
                org,
                'config.json',
                'dugit-config',
                JSON.stringify(defaultConfigRepo, null, 2),
                'Initial commit'
            )
            spinner.succeed(`Created Dugit config repository for ${org}`)
            return defaultConfigRepo
        } else {
            console.log(error)
            process.exit()
        }
    }
}

export async function updateConfigRepo(org: string, configRepo: ConfigRepo, message: string) {
    await api.updateRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify(configRepo, null, 2), message)
}
