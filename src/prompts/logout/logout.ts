import utils from '@/utils/utils.js'

export async function logout() {
    await utils.auth.logout()
}
