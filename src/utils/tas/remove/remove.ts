import ora from 'ora'

import { TA } from '@/utils/tas/tas.js'
import { Classroom } from '@/api/classroom.js'
import getConfigRepo, { updateConfigRepo } from '@/utils/configRepo.js'

export default async function remove(ta: TA, classroom: Classroom) {
    const spinner = ora(`Removing ${ta.name} from ${classroom.name}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const taExistsIndex = configRepo.tas.findIndex(t => t.username === ta.username)

    if (taExistsIndex > -1) {
        configRepo.tas.splice(taExistsIndex, 1)
    }

    await updateConfigRepo(org, configRepo, `Remove ${ta.name}`)
    spinner.succeed(`Removed ${ta.name} from ${classroom.name}`)
}
