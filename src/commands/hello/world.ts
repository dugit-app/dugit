import { Command } from '@oclif/core'

import { login } from '../../utils/auth.js'

export default class World extends Command {
    static args = {}

    static description = 'Say hello world'

    static examples = [
        `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
    ]

    static flags = {}

    async run(): Promise<void> {
        await login()
    }
}
