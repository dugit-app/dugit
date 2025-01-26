import utils from '@/utils/utils.js'
import { confirm } from '@/utils/prompts.js'
import * as process from 'node:process'

export default async function logout() {
    const confirmLogout = await confirm(`Are you sure you want to logout?`)

    if (confirmLogout) {
        await utils.auth.logout()
        console.log('Logged out')
        process.exit()
    }
}
