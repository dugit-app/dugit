import { logout } from '@/utils/auth/auth.js'
import { confirm } from '@/utils/prompts/prompts.js'
import { exit } from 'node:process'

export async function logoutPrompt() {
    const confirmLogout = await confirm(`Are you sure you want to logout?`)

    if (confirmLogout) {
        await logout()
        console.log('Logged out')
        exit()
    }
}
