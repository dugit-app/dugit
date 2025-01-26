import { getAcceptedAssignments, getAssignments } from '@/api/assignment.js'
import { getClassroom, getClassrooms } from '@/api/classroom.js'
import { createRepository, getRepositoryFile, createRepositoryFile, updateRepositoryFile } from '@/api/repo.js'

export default {
    getAssignments,
    getAcceptedAssignments,
    getClassrooms,
    getClassroom,
    createRepository,
    getRepositoryFile,
    createRepositoryFile,
    updateRepositoryFile,
}
