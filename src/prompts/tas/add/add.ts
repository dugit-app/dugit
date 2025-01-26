import { input } from '@/utils/prompts.js'

import utils from '@/utils/utils.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(classroom: Classroom) {
    const name = await input('Enter the teaching assistant\'s name')
    const email = await input('Enter the teaching assistant\'s email')
    const username = await input('Enter the teaching assistant\'s GitHub username')

    await utils.tas.add({
        name,
        email,
        username
    }, classroom)
}
