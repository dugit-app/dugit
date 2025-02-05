import { getClassrooms } from '@/api/classroom/classroom.js'
import { hideClassrooms } from '@/utils/classroom/hide/hide.js'
import { readConfigFile } from '@/utils/config/file/file.js'
import { checkbox } from '@/utils/prompts/prompts.js'
import ora from 'ora'

export async function hide() {
    const spinner = ora().start()
    const classrooms = await getClassrooms()
    const configFile = await readConfigFile()
    const hiddenClassrooms = configFile.hiddenClassrooms != undefined ? configFile.hiddenClassrooms : []
    spinner.stop()

    const classroomsSelect = await checkbox({
        message: `Select classrooms to hide`,
        choices: classrooms.map((classroom) => ({
            name: classroom.name,
            value: classroom,
            checked: hiddenClassrooms.find((id) => id == classroom.id) != undefined,
        })),
        noOptionsMessage: 'No classrooms exist for your account',
    })

    if (classroomsSelect === undefined) {
        return
    }

    await hideClassrooms(classroomsSelect)
}
