import add from '@/utils/grades/add/add.js'

export default {
    add
}

export type Grade = {
    name: string,
    assignmentId: number,
    anonymousNameMap: {
        studentName: string,
        anonymousName: string,
    }[]
}
