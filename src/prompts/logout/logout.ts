import { exit } from 'node:process'

import { confirm } from '@/utils/prompts/prompts.js'
import { logout } from '@/utils/auth/auth.js'

export async function logoutPrompt() {
    const confirmLogout = await confirm(`Are you sure you want to logout?`)

    if (confirmLogout) {
        await logout()
        console.log('Logged out')
        exit()
    }
}
