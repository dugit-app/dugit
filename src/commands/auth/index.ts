import { Command, Flags, loadHelpClass } from '@oclif/core'

export default class Auth extends Command {
    static args = {}

    static description = 'Manage GitHub authentication.'

    static flags = {
        help: Flags.help({ char: 'h', required: false }),
    }

    async run(): Promise<void> {
        await new (await loadHelpClass(this.config))(this.config).showHelp([Auth.id])
    }
}
