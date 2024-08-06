import { Command } from '@oclif/core'

import { login } from '../../utils/auth.js'

export default class Login extends Command {
    static args = {}

    static description = 'Authenticate with GitHub.'

    static flags = {}

    async run(): Promise<void> {
        await login()
    }
}
