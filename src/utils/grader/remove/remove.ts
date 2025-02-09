import { Classroom } from '@/api/classroom/classroom.js'
import { getOrganizationMembership, removeOrganizationMember } from '@/api/org/org.js'
import { getConfigRepo, updateConfigRepo } from '@/utils/config/repo/repo.js'
import { Grader } from '@/utils/grader/grader.js'
import ora from 'ora'

export async function removeGrader(grader: Grader, classroom: Classroom) {
    const spinner = ora(`Removing ${grader.name} from ${classroom.name}`).start()
    const org = classroom.organization.login

    const configRepo = await getConfigRepo(org)

    const graderExistsIndex = configRepo.graders.findIndex(t => t.username == grader.username)

    if (graderExistsIndex > -1) {
        configRepo.graders.splice(graderExistsIndex, 1)
    } else {
        spinner.fail(`Grader with username ${grader.username} does not exist in ${classroom.name}`)
        return
    }

    await updateConfigRepo(org, configRepo, `Remove ${grader.name} from ${classroom.name}`)

    const membership = await getOrganizationMembership(org, grader.username)

    if (membership != 'admin') {
        await removeOrganizationMember(org, grader.username)
    }

    spinner.succeed(`Removed ${grader.name} from ${classroom.name}`)
}
