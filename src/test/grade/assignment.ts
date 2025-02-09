import { getAssignments } from '@/api/assignment/assignment.js'
import { getClassroom, getClassrooms } from '@/api/classroom/classroom.js'

export async function getAssignment() {
    const classrooms = await getClassrooms()
    const classroomSelect = classrooms.find(classroom => classroom.name == 'Dugit Testing')

    if (!classroomSelect) {
        throw new Error('Dugit Testing Classroom not found')
    }

    const classroom = await getClassroom(classroomSelect.id)

    const assignments = await getAssignments(classroomSelect.id)
    const assignment = assignments.at(0)

    if (!assignment) {
        throw new Error('Test assignment not found')
    }

    return { assignment, classroom }
}
