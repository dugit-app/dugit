import ora from 'ora'

import { getAssignment } from '../../api/assignment.js'
import { getClassroom } from '../../api/classroom.js'
import { deleteRepository } from '../../api/org.js'
import { Grade, readConfigFile, writeConfigFile } from '../files.js'

// eslint-disable-next-line max-params
export async function createGrade(assignmentID: number, name: string, instructions: string, availablePoints: number, instructorRepositoryName: string, teachingAssistantRepositoryName: string, anonymousRepositoryNames: {
    anonymousName: string,
    repositoryName: string,
    studentName: string
}[]): Promise<Grade> {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const grade = {
        availablePoints,
        instructions,
        name,
        repositories: {
            anonymous: anonymousRepositoryNames,
            instructor: instructorRepositoryName,
            teachingAssistant: teachingAssistantRepositoryName,
        },
    }

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        configFile.classrooms.push({
            assignments: [{
                grades: [grade],
                id: assignment.id,
                title: assignment.title,
            }],
            id: classroom.id,
            name: classroom.name,
            teachingAssistants: [],
        })

        await writeConfigFile(configFile)
        return grade
    }

    const configAssignment = configClassroom.assignments.find(a => a.id === assignmentID)

    if (configAssignment === undefined) {
        configClassroom.assignments.push({
            grades: [grade],
            id: assignment.id,
            title: assignment.title,
        })

        await writeConfigFile(configFile)
        return grade
    }

    configAssignment.grades.push(grade)

    await writeConfigFile(configFile)
    return grade
}

export async function getGrades(assignmentID: number) {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return []
    }

    const configAssignment = configClassroom.assignments.find(a => a.id === assignmentID)

    if (configAssignment === undefined) {
        return []
    }

    return configAssignment.grades
}

export async function getGrade(assignmentID: number, name: string) {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configAssignment = configClassroom?.assignments.find(a => a.id === assignmentID)
    return configAssignment?.grades.find(g => g.name === name)
}

export async function deleteGrade(assignmentID: number, name: string) {
    const spinner = ora('Deleting grade').start()

    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return
    }

    const configAssignment = configClassroom.assignments.find(a => a.id === assignmentID)

    if (configAssignment === undefined) {
        return
    }

    const gradeIndex = configAssignment.grades.findIndex(g => g.name === name)

    if (gradeIndex > -1) {
        const { repositories } = configAssignment.grades[gradeIndex]
        const organizationName = classroom.organization.login

        for await (const anonymous of repositories.anonymous) {
            spinner.text = `Deleting ${anonymous.studentName}'s repository`
            await deleteRepository(organizationName, anonymous.repositoryName)
        }

        spinner.text = 'Deleting teaching assistant repository'
        await deleteRepository(organizationName, repositories.teachingAssistant)
        spinner.text = 'Deleting instructor repository'
        await deleteRepository(organizationName, repositories.instructor)

        configAssignment.grades.splice(gradeIndex, 1)

        await writeConfigFile(configFile)
        spinner.succeed('Grade deleted')
        return
    }

    spinner.fail('Grade not found')
}
