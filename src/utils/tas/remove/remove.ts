import ora from 'ora'

import { TA } from '@/utils/tas/tas.js'
import { Classroom } from '@/api/classroom.js'
import api from '@/api/api.js'

export default async function remove(ta: TA, classroom: Classroom) {
    const spinner = ora(`Removing ${ta.name} from ${classroom.name}`).start()
    const org = classroom.organization.login

    const configFile: { tas: TA[] } = await api.getRepositoryFile(org, 'config.json', 'dugit-config')

    const taExistsIndex = configFile.tas.findIndex(t => t.username === ta.username)

    if (taExistsIndex > -1) {
        configFile.tas.splice(taExistsIndex, 1)
    }

    await api.updateRepositoryFile(org, 'config.json', 'dugit-config', JSON.stringify(configFile, null, 2), `Remove ${ta.name}`)

    spinner.succeed(`Removed ${ta.name} from ${classroom.name}`)
}
