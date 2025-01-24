import { input } from '@inquirer/prompts'
import chalk from 'chalk'

import utils from '@/utils/utils.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(classroom: Classroom) {
    const name = await input({ message: 'Enter the teaching assistant\'s name' }, { clearPromptOnDone: true })
    const email = await input({ message: 'Enter the teaching assistant\'s email' }, { clearPromptOnDone: true })
    const username = await input({ message: 'Enter the teaching assistant\'s GitHub username' }, { clearPromptOnDone: true })

    await utils.tas.add({
        name,
        email,
        username,
        classroom
    })

    console.log(chalk.green(`${name} successfully added`))
}
