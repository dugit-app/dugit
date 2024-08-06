import { Command, Flags } from '@oclif/core'
import { listClassrooms } from '../../utils/classroom.js'

export default class Auth extends Command {
    static args = {}

    static description = 'Manage GitHub Classroom.'

    static flags = {
        help: Flags.help({ char: 'h', required: false }),
    }

    async run(): Promise<void> {
        await listClassrooms()
    }
}
