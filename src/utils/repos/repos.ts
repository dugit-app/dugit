import { deleteRepo, Repos } from '@/api/repo/repo.js'
import ora from 'ora'

export async function removeRepo(repos: Repos, org: string) {
    const spinner = ora(`Deleting selected repositories from ${org}`).start()

    for (const repo of repos) {
        await deleteRepo(org, repo.name)
    }

    spinner.succeed(`Deleted selected repositories from ${org}`)
}
