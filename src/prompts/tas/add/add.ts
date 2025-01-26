import { input } from '@/utils/prompts/prompts.js'

import utils from '@/utils/utils.js'
import { Classroom } from '@/api/classroom.js'

export default async function add(classroom: Classroom) {
    const name = await input('Enter the teaching assistant\'s name')
    const username = await input('Enter the teaching assistant\'s GitHub username')

    await utils.tas.add({
        name,
        username
    }, classroom)
}
