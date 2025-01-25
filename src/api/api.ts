import { getAssignments } from '@/api/assignment.js'
import { getClassroom, getClassrooms } from '@/api/classroom.js'
import { createRepository, getRepositoryFile, createRepositoryFile, updateRepositoryFile } from '@/api/repository.js'

export default {
    getAssignments,
    getClassrooms,
    getClassroom,
    createRepository,
    getRepositoryFile,
    createRepositoryFile,
    updateRepositoryFile,
}
