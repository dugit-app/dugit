import api from '@/api/api.js'

export async function getAssignment() {
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

    return { assignment, classroom }
}
