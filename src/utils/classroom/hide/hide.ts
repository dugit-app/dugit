import { Classrooms } from '@/api/classroom/classroom.js'
import { readConfigFile, writeConfigFile } from '@/utils/config/file/file.js'

export async function hideClassrooms(classrooms: Classrooms) {
    const configFile = await readConfigFile()

    if (classrooms.length == 0) {
        delete configFile.hiddenClassrooms
    } else {
        configFile.hiddenClassrooms = classrooms.map((classroom) => classroom.id)
    }

    await writeConfigFile(configFile)
}

export async function getNonHiddenClassrooms(classrooms: Classrooms) {
    const configFile = await readConfigFile()

    if (!Object.hasOwn(configFile, 'hiddenClassrooms') || configFile.hiddenClassrooms == undefined) {
        return classrooms
    }

    const hidden = configFile.hiddenClassrooms

    return classrooms.filter((classroom) => hidden.find((id) => classroom.id == id) == undefined)
}
