import { getAcceptedAssignments, getAssignments } from '@/api/assignment.js'
import { getClassroom, getClassrooms } from '@/api/classroom.js'
import { createRepo, getRepoFile, createRepoFile, updateRepoFile } from '@/api/repo.js'

export default {
    getAssignments,
    getAcceptedAssignments,
    getClassrooms,
    getClassroom,
    createRepo,
    getRepoFile,
    createRepoFile,
    updateRepoFile,
}
