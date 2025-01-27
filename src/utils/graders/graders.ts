import add from '@/utils/graders/add/add.js'
import edit from '@/utils/graders/edit/edit.js'
import remove from '@/utils/graders/remove/remove.js'
import get from '@/utils/graders/get/get.js'

export default {
    add,
    edit,
    remove,
    get,
}

export type Grader = {
    name: string,
    username: string,
}
