import { Command, Flags } from '@oclif/core'

import { organizationCommand } from '../../prompts/org.js'

export default class Org extends Command {
    static args = {}

    static description = 'Manage GitHub organizations.'

    static flags = {
        help: Flags.help({ char: 'h', required: false }),
    }

    async run(): Promise<void> {
        await organizationCommand()
    }
}
