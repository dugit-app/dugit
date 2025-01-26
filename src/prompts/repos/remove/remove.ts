import { checkbox, confirm } from '@/utils/prompts/prompts.js'
import utils from '@/utils/utils.js'
import { Organizations } from '@/api/org.js'
import { getRepositories } from '@/api/repo.js'

export default async function remove(org: Organizations[number]) {
    const repos = await checkbox({
        message: 'Select repositories to delete',
        choices: (await getRepositories(org.login)).map((repo) => ({
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
