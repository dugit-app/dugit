import { Command, Flags } from '@oclif/core'

import { login } from '../../utils/auth.js'

export default class Login extends Command {
    static args = {}

    static description = 'Authenticate with GitHub.'

    static flags = {
        help: Flags.help({ char: 'h', required: false }),
    }

    async run(): Promise<void> {
        await login()
    }
}
