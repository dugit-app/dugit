import { TA } from '@/utils/tas/tas.js'
import { getRepository } from '@/api/repository.js'
import { RequestError } from 'octokit'

export default async function add(ta: TA) {
    /*
    Create organization repo if it doesn't exist
    Check if ta already in the repo json config
    Add ta to the repo json config
     */
    try {
        await getRepository('braydenoneal', 'dugit')
    } catch (e) {
        if (e instanceof RequestError) {
            console.log('Repository does not exist')
        }
    }
}
