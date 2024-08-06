import { Command } from '@oclif/core'

import { logout } from '../../utils/auth.js'

export default class Logout extends Command {
    static args = {}

    static description = 'Remove GitHub authentication.'

    static flags = {}

    async run(): Promise<void> {
        await logout()
    }
}
