import { randomUUID } from 'node:crypto'
import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Octokit } from 'octokit'
import { simpleGit } from 'simple-git'
import slug from 'slug'

import { getAccessToken, tokenizeURL } from './auth.js'
import { configDirectoryPath } from './config.js'
import { readConfigFile, writeConfigFile } from './files.js'
import { headers } from './octokit.js'
import { deleteRepository } from './org.js'

export async function getClassrooms() {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms', { headers })).data
}

export async function getClassroom(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export async function getAssignments(classroomID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /classrooms/{classroom_id}/assignments', {
        'classroom_id': classroomID,
        headers,
    })).data
}

export async function getAssignment(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}', {
        'assignment_id': assignmentID,
        headers,
    })).data
}

export async function getAcceptedAssignments(assignmentID: number) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('GET /assignments/{assignment_id}/accepted_assignments', {
        'assignment_id': assignmentID,
        headers,
    })).data
}

export async function createNewTeachingAssistant(classroomID: number, name: string, username: string, email: string) {
    const classroom = await getClassroom(classroomID)
    const teachingAssistant = { email, name, username }

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        configFile.classrooms.push({
            assignments: [],
            id: classroom.id,
            name: classroom.name,
            teachingAssistants: [teachingAssistant],
        })

        await writeConfigFile(configFile)
        return
    }

    const configTeachingAssistant = configClassroom.teachingAssistants.find(t => {
        const nameMatches = t.name === name
        const usernameMatches = t.username === username
        const emailMatches = t.email === email

        if (nameMatches) {
            console.log('A teaching assistant with that name already exists')
        }

        if (usernameMatches) {
            console.log('A teaching assistant with that username already exists')
        }

        if (emailMatches) {
            console.log('A teaching assistant with that email already exists')
        }

        return nameMatches || usernameMatches || emailMatches
    })

    if (configTeachingAssistant === undefined) {
        configClassroom.teachingAssistants = [teachingAssistant]
    }

    await writeConfigFile(configFile)
}

export async function getTeachingAssistants(classroomID: number) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return []
    }

    return configClassroom.teachingAssistants
}

export async function getTeachingAssistant(classroomID: number, username: string) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    return configClassroom?.teachingAssistants.find(t => t.username === username)
}

export async function setTeachingAssistantName(classroomID: number, username: string, name: string) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.name = name

        await writeConfigFile(configFile)
    }
}

export async function setTeachingAssistantUsername(classroomID: number, username: string, newUsername: string) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.username = newUsername

        await writeConfigFile(configFile)
    }
}

export async function setTeachingAssistantEmail(classroomID: number, username: string, email: string) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)
    const configTeachingAssistant = configClassroom?.teachingAssistants.find(t => t.username === username)

    if (configTeachingAssistant !== undefined) {
        configTeachingAssistant.email = email

        await writeConfigFile(configFile)
    }
}

export async function deleteTeachingAssistant(classroomID: number, username: string) {
    const classroom = await getClassroom(classroomID)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        return
    }

    const teachingAssistantIndex = configClassroom.teachingAssistants.findIndex(t => t.username === username)

    if (teachingAssistantIndex > -1) {
        configClassroom.teachingAssistants.splice(teachingAssistantIndex, 1)

        await writeConfigFile(configFile)
    }
}

// eslint-disable-next-line max-params
export async function createGrade(assignmentID: number, name: string, instructions: string, availablePoints: number, instructorRepositoryName: string, teachingAssistantRepositoryName: string, anonymousRepositoryNames: string[]) {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const configFile = await readConfigFile()

    const configClassroom = configFile.classrooms.find(c => c.id === classroom.id)

    if (configClassroom === undefined) {
        configFile.classrooms.push({
            assignments: [{
                grades: [{
                    availablePoints,
                    instructions,
                    name,
                    repositories: {
                        anonymous: anonymousRepositoryNames,
                        instructor: instructorRepositoryName,
                        teachingAssistant: teachingAssistantRepositoryName,
                    },
                }],
                id: assignment.id,
                title: assignment.title,
            }],
            id: classroom.id,
            name: classroom.name,
            teachingAssistants: [],
        })

        await writeConfigFile(configFile)
        return
    }

    const configAssignment = configClassroom.assignments.find(a => a.id === assignmentID)

    if (configAssignment === undefined) {
        configClassroom.assignments.push({
            grades: [{
                availablePoints,
                instructions,
                name,
                repositories: {
                    anonymous: anonymousRepositoryNames,
                    instructor: instructorRepositoryName,
                    teachingAssistant: teachingAssistantRepositoryName,
                },
            }],
            id: assignment.id,
            title: assignment.title,
        })

        await writeConfigFile(configFile)
        return
    }

    configAssignment.grades.push({
        availablePoints,
        instructions,
        name,
        repositories: {
            anonymous: anonymousRepositoryNames,
            instructor: instructorRepositoryName,
            teachingAssistant: teachingAssistantRepositoryName,
        },
    })
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
            await deleteRepository(organizationName, anonymous)
        }

        await deleteRepository(organizationName, repositories.teachingAssistant)
        await deleteRepository(organizationName, repositories.instructor)

        configAssignment.grades.splice(gradeIndex, 1)

        await writeConfigFile(configFile)
    }
}

async function createRepository(name: string, org: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('POST /orgs/{org}/repos', {
        'has_issues': false,
        'has_projects': false,
        'has_wiki': false,
        headers,
        name,
        org,
        'private': true,
    })).data
}

async function addOrganizationMember(org: string, username: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('PUT /orgs/{org}/memberships/{username}', {
        headers,
        org,
        role: 'member',
        username,
    })).data
}

async function addRepositoryCollaborator(org: string, repo: string, username: string, permission: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    return (await octokit.request('PUT /repos/{org}/{repo}/collaborators/{username}', {
        headers,
        org,
        permission,
        repo,
        username,
    })).data
}

// eslint-disable-next-line max-params
async function pushAnonymousRepository(studentURL: string, anonymousURL: string, classroomID: number, organizationName: string, repositoryName: string) {
    const repositoryPath = join(configDirectoryPath, 'repo')
    await rm(repositoryPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    await git.clone((await tokenizeURL(studentURL)), repositoryPath)
    await git.cwd(repositoryPath)

    await git.remote(['set-url', '--push', 'origin', (await tokenizeURL(anonymousURL))])

    const branches = await git.branch(['-r'])

    for await (const branch of branches.all) {
        const branchName = branch.slice(branch.search('/') + 1)
        await git.checkout(branchName)

        await git.addConfig('user.email', 'user@example.com')
        await git.addConfig('user.name', 'Anonymous')

        await git.rebase(['-r', '--root', '--exec', 'git commit --amend --no-edit --reset-author'])
    }

    await git.push(['origin', '--all'])

    await rm(repositoryPath, { force: true, recursive: true })

    const teachingAssistants = await getTeachingAssistants(classroomID)

    for await (const teachingAssistant of teachingAssistants) {
        await addOrganizationMember(organizationName, teachingAssistant.username)
        await addRepositoryCollaborator(organizationName, repositoryName, teachingAssistant.username, 'triage')
    }
}

function generateAnonymousID() {
    return randomUUID()
}

async function pushInstructorRepository(URL: string, readMeString: string) {
    const repositoryPath = join(configDirectoryPath, 'repo')
    await rm(repositoryPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    const instructorURL = await tokenizeURL(URL)
    await git.clone(instructorURL, repositoryPath)

    await git.cwd(repositoryPath)

    await git.remote(['set-url', 'origin', instructorURL])

    await git.addConfig('user.email', 'user@example.com')
    await git.addConfig('user.name', 'dugit')

    await writeFile(join(repositoryPath, 'README.md'), readMeString)

    await git.add('README.md')
    await git.commit('Generate README.md')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })
}

// eslint-disable-next-line max-params
async function pushTeachingAssistantRepository(URL: string, readMeString: string, classroomID: number, organizationName: string, repositoryName: string) {
    const repositoryPath = join(configDirectoryPath, 'repo')
    await rm(repositoryPath, { force: true, recursive: true })

    const git = simpleGit()
    await git.cwd(configDirectoryPath)

    const teachingAssistantURL = await tokenizeURL(URL)
    await git.clone(teachingAssistantURL, repositoryPath)

    await git.cwd(repositoryPath)

    await git.remote(['set-url', 'origin', teachingAssistantURL])

    await git.addConfig('user.email', 'user@example.com')
    await git.addConfig('user.name', 'dugit')

    await writeFile(join(repositoryPath, 'README.md'), readMeString)

    // eslint-disable-next-line no-warning-comments
    // TODO: write grading file

    await git.add('README.md')
    await git.commit('Generate README.md')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })

    const teachingAssistants = await getTeachingAssistants(classroomID)

    for await (const teachingAssistant of teachingAssistants) {
        await addOrganizationMember(organizationName, teachingAssistant.username)
        await addRepositoryCollaborator(organizationName, repositoryName, teachingAssistant.username, 'triage')
    }
}

export async function createGradeRepositories(assignmentID: number, gradeName: string, gradingInstructions: string, availablePoints: number) {
    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const organizationName = classroom.organization.login
    const assignmentSlug = assignment.slug
    const gradeSlug = slug(gradeName)

    let instructorReadMeString = `# ${assignment.title} - ${gradeName} - Instructor\n\n`
    instructorReadMeString += `${gradingInstructions}\n\n`
    instructorReadMeString += `Available points: ${availablePoints}\n\n`
    instructorReadMeString += '| Name | Student repo | Anonymous repo |\n'
    instructorReadMeString += '| - | - | - |\n'

    let teachingAssistantReadMeString = `# ${assignment.title} - ${gradeName} - Teaching Assistant\n\n`
    teachingAssistantReadMeString += `${gradingInstructions}\n\n`
    teachingAssistantReadMeString += `Available points: ${availablePoints}\n\n`
    teachingAssistantReadMeString += '| ID | Anonymous repo |\n'
    teachingAssistantReadMeString += '| - | - |\n'

    const acceptedAssignments = await getAcceptedAssignments(assignmentID)

    const anonymousRepositoryNames = []

    for await (const acceptedAssignment of acceptedAssignments) {
        const id = generateAnonymousID()

        const anonymousRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-student-${id}`, organizationName)
        await pushAnonymousRepository(acceptedAssignment.repository.html_url, anonymousRepository.html_url, classroom.id, organizationName, anonymousRepository.name)

        instructorReadMeString += `| ${(acceptedAssignment.students.map(student => student.login)).join(', ')} `
        instructorReadMeString += `| [Student repo](${acceptedAssignment.repository.html_url}) `
        instructorReadMeString += `| [Anonymous repo](${anonymousRepository.html_url}) |\n`

        teachingAssistantReadMeString += `| ${id} `
        teachingAssistantReadMeString += `| [Anonymous repo](${anonymousRepository.html_url}) |\n`

        anonymousRepositoryNames.push(anonymousRepository.name)
    }

    const instructorRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-instructor`, organizationName)
    await pushInstructorRepository(instructorRepository.html_url, instructorReadMeString)

    const teachingAssistantRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-teaching-assistant`, organizationName)
    await pushTeachingAssistantRepository(teachingAssistantRepository.html_url, teachingAssistantReadMeString, classroom.id, organizationName, teachingAssistantRepository.name)

    await createGrade(assignmentID, gradeName, gradingInstructions, availablePoints, instructorRepository.name, teachingAssistantRepository.name, anonymousRepositoryNames)
}
