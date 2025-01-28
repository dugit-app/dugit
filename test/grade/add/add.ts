import api from '@/api/api.js'
import utils from '@/utils/utils.js'

export default async function add() {
    const classrooms = await api.getClassrooms()
    const classroomSelect = classrooms.find(classroom => classroom.name === 'Dugit Testing')

    if (!classroomSelect) {
        throw new Error('Dugit Testing Classroom not found')
    }

    const classroom = await api.getClassroom(classroomSelect.id)

    const assignments = await api.getAssignments(classroomSelect.id)
    const assignment = assignments.at(0)

    if (!assignment) {
        throw new Error('Test assignment not found')
    }

    await utils.grades.add('Test', assignment, classroom)
}
