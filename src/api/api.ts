import { getAccessToken } from '@/utils/auth/auth.js'
import { Octokit } from 'octokit'

class API {
    octokit: Octokit

    constructor(octokit: Octokit) {
        this.octokit = octokit
    }

    static async create() {
        return new API(new Octokit({ auth: await getAccessToken() }))
    }

    async updateToken() {
        this.octokit = new Octokit({ auth: await getAccessToken() })
    }
}

export const api = await API.create()
