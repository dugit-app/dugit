import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Octokit } from 'octokit'
import open from 'open'
import ora from 'ora'
import { simpleGit } from 'simple-git'
import slug from 'slug'
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator'

import { getAccessToken, tokenizeURL } from './auth.js'
import { configDirectoryPath } from './config.js'
import { Grade, TeachingAssistantGrades, readConfigFile, writeConfigFile, writeJsonFile } from './files.js'
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
async function pushAnonymousRepository(studentURL: string, anonymousURL: string, classroomID: number, organizationName: string, repositoryName: string, anonymousName: string) {
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
        await git.addConfig('user.name', anonymousName)

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

function generateAnonymousName() {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-' })
}

async function pushInstructorRepository(URL: string, readMeString: string, grade: Grade) {
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

    await writeJsonFile(join(repositoryPath, 'grades.json'), grade)
    await git.add('grades.json')

    await git.commit('Generate files')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })
}

async function updateInstructorGrades(URL: string, gradeFileString: string) {
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

    await writeFile(join(repositoryPath, 'grades.md'), gradeFileString)
    await git.add('grades.md')

    await git.commit('Update grades')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })
}

// eslint-disable-next-line max-params
async function pushTeachingAssistantRepository(URL: string, readMeString: string, classroomID: number, organizationName: string, repositoryName: string, grade: Grade) {
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
    await git.add('README.md')

    const grades: TeachingAssistantGrades = grade.repositories.anonymous.map(anonymous => ({
        comments: '',
        grade: '',
        name: anonymous.anonymousName,
    }))

    await writeJsonFile(join(repositoryPath, 'grades.json'), grades)
    await git.add('grades.json')

    await git.commit('Generate files')
    await git.push(['-u', 'origin', 'main'])

    await rm(repositoryPath, { force: true, recursive: true })

    const teachingAssistants = await getTeachingAssistants(classroomID)

    for await (const teachingAssistant of teachingAssistants) {
        await addOrganizationMember(organizationName, teachingAssistant.username)
        await addRepositoryCollaborator(organizationName, repositoryName, teachingAssistant.username, 'push')
    }
}

export async function createGradeRepositories(assignmentID: number, gradeName: string, gradingInstructions: string, availablePoints: number) {
    const spinner = ora('Generating grading repositories').start()

    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)

    const organizationName = classroom.organization.login
    const assignmentSlug = assignment.slug
    const gradeSlug = slug(gradeName)

    let instructorReadMeString = '| Student repo | Anonymous repo |\n'
    instructorReadMeString += '| - | - |\n'

    let teachingAssistantReadMeString = `# ${assignment.title} - ${gradeName} - Teaching Assistant\n\n`
    teachingAssistantReadMeString += `${gradingInstructions}\n\n`
    teachingAssistantReadMeString += `Available points: ${availablePoints}\n\n`
    teachingAssistantReadMeString += '| Anonymous repo |\n'
    teachingAssistantReadMeString += '| - |\n'

    const acceptedAssignments = await getAcceptedAssignments(assignmentID)

    const anonymousRepositoryNames = []

    const anonymousNames: string[] = []

    for await (const acceptedAssignment of acceptedAssignments) {
        let anonymousName = generateAnonymousName()

        while (anonymousNames.includes(anonymousName)) {
            anonymousName = generateAnonymousName()
        }

        anonymousNames.push(anonymousName)

        const studentName = (acceptedAssignment.students.map(student => student.login)).join(', ')

        spinner.text = `Creating anonymous repository for ${studentName}`

        const anonymousRepository = await createRepository(`${assignmentSlug}-${gradeSlug}-student-${anonymousName}`, organizationName)
        await pushAnonymousRepository(acceptedAssignment.repository.html_url, anonymousRepository.html_url, classroom.id, organizationName, anonymousRepository.name, anonymousName)

        instructorReadMeString += `| [${studentName}](${acceptedAssignment.repository.html_url}) `
        instructorReadMeString += `| [${anonymousName}](${anonymousRepository.html_url}) |\n`

        teachingAssistantReadMeString += `| [${anonymousName}](${anonymousRepository.html_url}) |\n`

        anonymousRepositoryNames.push({ anonymousName, repositoryName: anonymousRepository.name, studentName })
    }

    spinner.text = 'Creating instructor repository'

    const teachingAssistantRepositoryName = `${assignmentSlug}-${gradeSlug}-teaching-assistant`
    const instructorRepositoryName = `${assignmentSlug}-${gradeSlug}-instructor`

    const grade = await createGrade(assignmentID, gradeName, gradingInstructions, availablePoints, instructorRepositoryName, teachingAssistantRepositoryName, anonymousRepositoryNames)

    spinner.text = 'Creating teaching assistant repository'

    const teachingAssistantRepository = await createRepository(teachingAssistantRepositoryName, organizationName)
    await pushTeachingAssistantRepository(teachingAssistantRepository.html_url, teachingAssistantReadMeString, classroom.id, organizationName, teachingAssistantRepository.name, grade)

    let instructorReadMeHeader = `# ${assignment.title} - ${gradeName} - Instructor\n\n`
    instructorReadMeHeader += `[Teaching assistant repository](${teachingAssistantRepository.html_url})\n\n`
    instructorReadMeHeader += `${gradingInstructions}\n\n`
    instructorReadMeHeader += `Available points: ${availablePoints}\n\n`

    const instructorRepository = await createRepository(instructorRepositoryName, organizationName)
    await pushInstructorRepository(instructorRepository.html_url, instructorReadMeHeader + instructorReadMeString, grade)

    await open(instructorRepository.html_url)

    spinner.succeed('Generated grading repositories')
}

async function getRepositoryFile(owner: string, path: string, repo: string) {
    const octokit = new Octokit({ auth: await getAccessToken() })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return JSON.parse((await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        headers: {...headers, accept: 'application/vnd.github.raw+json'},
        owner,
        path,
        repo,
    })).data)
}

export async function updateGrade(assignmentID: number, name: string) {
    const spinner = ora('Updating grades on instructor repository').start()

    const assignment = await getAssignment(assignmentID)
    const classroom = await getClassroom(assignment.classroom.id)
    const gradeInfo = await getGrade(assignmentID, name)

    if (gradeInfo === undefined) {
        return
    }

    spinner.text = 'Getting grading file from teaching assistant repository'
    const teachingAssistantGradingFile: TeachingAssistantGrades = await getRepositoryFile(classroom.organization.login, 'grades.json', gradeInfo.repositories.teachingAssistant)

    spinner.text = 'Generating grades file for instructor repository'
    let instructorGradeFile: string = '# Grades\n'

    for (const grade of teachingAssistantGradingFile) {
        const anonymous = gradeInfo.repositories.anonymous.find(a => a.anonymousName === grade.name)

        if (anonymous === undefined) {
            break
        }

        instructorGradeFile += `\n## ${anonymous.studentName}\n\n`
        instructorGradeFile += `Grade: ${grade.grade}\n\n`
        instructorGradeFile += `Comments: ${grade.comments}\n`
    }

    spinner.text = 'Uploading grades file to instructor repository'

    await updateInstructorGrades(`https://github.com/${classroom.organization.login}/${gradeInfo.repositories.instructor}`, instructorGradeFile)

    spinner.succeed('Updated grades on instructor repository')
}
