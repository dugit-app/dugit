import utils from '@/utils/utils.js'

export default async function logout() {
    await utils.auth.logout()
}
