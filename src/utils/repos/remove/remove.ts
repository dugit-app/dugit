import { deleteRepository, Repos } from '@/api/repo.js'
import ora from 'ora'

export async function remove(repos: Repos, org: string) {
    const spinner = ora(`Deleting selected repositories from ${org}`).start()

    for (const repo of repos) {
        await deleteRepository(org, repo.name)
    }

    spinner.succeed(`Deleted selected repositories from ${org}`)
}
