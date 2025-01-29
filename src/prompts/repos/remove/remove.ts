import { checkbox, confirm } from '@/utils/prompts/prompts.js'
import utils from '@/utils/utils.js'
import { Organizations } from '@/api/org.js'
import { getRepos } from '@/api/repo.js'
import ora from 'ora'

export default async function remove(org: Organizations[number]) {
    const spinner = ora().start()
    const allRepos = await getRepos(org.login)
    spinner.stop()

    const repos = await checkbox({
        message: 'Select repositories to delete',
        choices: allRepos.map((repo) => ({
            name: repo.name,
            value: repo,
        })),
        noOptionsMessage: `No repositories exist for ${org.login}`,
    })

    if (!repos) {
        return
    }

    const confirmRemove = await confirm(`Are you sure you want to permanently delete the selected repositories in ${org.login}?`)

    if (confirmRemove) {
        await utils.repos.remove(repos, org.login)
    }
}
