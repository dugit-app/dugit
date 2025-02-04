import { Classroom } from '@/api/classroom/classroom.js'
import { getOrganizationAppInstallations, Organizations } from '@/api/org/org.js'
import { appID, appInstallationLink } from '@/utils/config/config.js'
import chalk from 'chalk'
import { Ora } from 'ora'

export async function isAppInstalled(classroom: Classroom, spinner: Ora) {
    const apps = await getOrganizationAppInstallations(classroom.organization.login)

    if (!apps || apps.findIndex(app => app.app_id == appID) == -1) {
        spinner.stop()
        console.log(chalk.yellow(`The Dugit GitHub App is not installed on ${classroom.name}. Please visit ${chalk.cyan(appInstallationLink)}`))
        return false
    }

    return true
}

export async function isAppInstalledOrg(org: Organizations[number]) {
    const apps = await getOrganizationAppInstallations(org.login)

    if (!apps || apps.findIndex(app => app.app_id == appID) == -1) {
        console.log(chalk.yellow(`The Dugit GitHub App is not installed on ${org.login}. Please visit ${chalk.cyan(appInstallationLink)}`))
        return false
    }

    return true
}
