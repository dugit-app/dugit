import { Command, Flags } from '@oclif/core'

import { selectClassroom } from '../../prompts/classroom.js'

export default class Classroom extends Command {
    static args = {}

    static description = 'Manage GitHub Classroom.'

    static flags = {
        help: Flags.help({ char: 'h', required: false }),
    }

    async run(): Promise<void> {
        await selectClassroom()
    }
}
