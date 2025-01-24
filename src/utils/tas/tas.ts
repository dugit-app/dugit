import add from '@/utils/tas/add/add.js'
import edit from '@/utils/tas/edit/edit.js'
import remove from '@/utils/tas/remove/remove.js'

export default {
    add,
    edit,
    remove,
}

export type TA = {
    name: string,
    email: string,
    username: string,
    classroomId: number
}
