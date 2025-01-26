import add from '@/utils/tas/add/add.js'
import edit from '@/utils/tas/edit/edit.js'
import remove from '@/utils/tas/remove/remove.js'
import get from '@/utils/tas/get/get.js'

export default {
    add,
    edit,
    remove,
    get,
}

export type TA = {
    name: string,
    username: string,
}
