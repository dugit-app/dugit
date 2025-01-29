import { RequestError } from 'octokit'
import * as process from 'node:process'

import { remove } from '@/utils/repos/remove/remove.js'
import { getRepo } from '@/api/repo.js'

export default {
    remove,
}

export async function repoExists(owner: string, repo: string) {
    try {
        await getRepo(owner, repo)
        return true
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return false
        }

        console.log(error)
        process.exit()
    }
}
