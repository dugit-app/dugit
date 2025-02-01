import { Organizations } from '@/api/org/org.js'
import { getRepos } from '@/api/repo/repo.js'
import { checkbox, confirm } from '@/utils/prompts/prompts.js'
import { removeRepo } from '@/utils/repos/repos.js'
import ora from 'ora'

export async function removeRepoPrompt(org: Organizations[number]) {
    const spinner = ora().start()
    const allRepos = await getRepos(org.login)
    spinner.stop()

    const repos = await checkbox({
        message: `${org.login} > Select repositories to delete`,
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
        await removeRepo(repos, org.login)
    }
}
