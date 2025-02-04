import { getAccessToken } from '@/utils/auth/auth.js'
import { Octokit } from 'octokit'

export const api = new Octokit({ auth: await getAccessToken() })
