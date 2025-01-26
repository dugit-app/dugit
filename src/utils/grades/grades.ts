import add from '@/utils/grades/add/add.js'
import remove from '@/utils/grades/remove/remove.js'
import get from '@/utils/grades/get/get.js'
import view from '@/utils/grades/view/view.js'

export default {
    add,
    remove,
    get,
    view,
}

export type Grade = {
    name: string,
    assignmentId: number,
    anonymousNamesMap: {
        studentRepoLink: string,
        studentName: string,
        anonymousName: string,
    }[]
}
