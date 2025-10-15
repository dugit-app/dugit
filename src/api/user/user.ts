import { api } from '@/api/api.js'
import { RequestError } from '@octokit/request-error'

export async function userExists(username: string) {
    try {
        await api.octokit.rest.users.getByUsername({ username })
        return true
    } catch (error) {
        if (error instanceof RequestError && error.status == 404) {
            return false
        }

        throw error
    }
}
