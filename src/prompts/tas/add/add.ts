import { input } from '@inquirer/prompts'

import utils from '@/utils/utils.js'
import chalk from 'chalk'

export default async function add(classroomId: number) {
    const name = await input({ message: 'Enter the teaching assistant\'s name' }, { clearPromptOnDone: true })
    const email = await input({ message: 'Enter the teaching assistant\'s email' }, { clearPromptOnDone: true })
    const username = await input({ message: 'Enter the teaching assistant\'s GitHub username' }, { clearPromptOnDone: true })

    await utils.tas.add({
        name,
        email,
        username,
        classroomId
    })

    console.log(chalk.green('TA successfully added'))
}
