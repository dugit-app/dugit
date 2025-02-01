import { deleteRepo, getRepo, Repos } from '@/api/repo/repo.js'
import { exit } from 'node:process'
import { RequestError } from 'octokit'
import ora from 'ora'

export async function repoExists(owner: string, repo: string) {
    try {
        await getRepo(owner, repo)
        return true
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return false
        }

        console.log(error)
        exit()
    }
}

export async function removeRepo(repos: Repos, org: string) {
    const spinner = ora(`Deleting selected repositories from ${org}`).start()

    for (const repo of repos) {
        await deleteRepo(org, repo.name)
    }

    spinner.succeed(`Deleted selected repositories from ${org}`)
}
