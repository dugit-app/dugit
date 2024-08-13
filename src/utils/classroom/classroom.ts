import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import open from 'open'
import ora from 'ora'
import { simpleGit } from 'simple-git'
import slug from 'slug'
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator'

import { getAcceptedAssignments, getAssignment } from '../../api/assignment.js'
import { Classrooms, getClassroom } from '../../api/classroom.js'
import { addOrganizationMember } from '../../api/org.js'
import { addRepositoryCollaborator, createRepository, getRepositoryFile } from '../../api/repository.js'
import { tokenizeURL } from '../auth.js'
import { configDirectoryPath } from '../config.js'
import { Grade, TeachingAssistantGrades, writeJsonFile } from '../files.js'
import { createGrade, getGrade } from './grade.js'
import { getTeachingAssistants } from './teaching-assistant.js'

function generateAnonymousName() {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-' })
}

// eslint-disable-next-line max-params
async function pushAnonymousRepository(studentURL: string, anonymousURL: string, classroom: Classrooms[number], organizationName: string, repositoryName: string, anonymousName: string) {
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

    const teachingAssistants = await getTeachingAssistants(classroom)

    for await (const teachingAssistant of teachingAssistants) {
        await addOrganizationMember(organizationName, teachingAssistant.username)
        await addRepositoryCollaborator(organizationName, repositoryName, teachingAssistant.username, 'triage')
    }
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
async function pushTeachingAssistantRepository(URL: string, readMeString: string, classroom: Classrooms[number], organizationName: string, repositoryName: string, grade: Grade) {
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

    const teachingAssistants = await getTeachingAssistants(classroom)

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
        await pushAnonymousRepository(acceptedAssignment.repository.html_url, anonymousRepository.html_url, classroom, organizationName, anonymousRepository.name, anonymousName)

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
    await pushTeachingAssistantRepository(teachingAssistantRepository.html_url, teachingAssistantReadMeString, classroom, organizationName, teachingAssistantRepository.name, grade)

    let instructorReadMeHeader = `# ${assignment.title} - ${gradeName} - Instructor\n\n`
    instructorReadMeHeader += `[Teaching assistant repository](${teachingAssistantRepository.html_url})\n\n`
    instructorReadMeHeader += `${gradingInstructions}\n\n`
    instructorReadMeHeader += `Available points: ${availablePoints}\n\n`

    const instructorRepository = await createRepository(instructorRepositoryName, organizationName)
    await pushInstructorRepository(instructorRepository.html_url, instructorReadMeHeader + instructorReadMeString, grade)

    await open(instructorRepository.html_url)

    spinner.succeed('Generated grading repositories')
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
