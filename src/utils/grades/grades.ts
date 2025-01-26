import add from '@/utils/grades/add/add.js'
import remove from '@/utils/grades/remove/remove.js'
import get from '@/utils/grades/get/get.js'

export default {
    add,
    remove,
    get,
}

export type Grade = {
    name: string,
    assignmentId: number,
    anonymousNameMap: {
        studentName: string,
        anonymousName: string,
    }[]
}
