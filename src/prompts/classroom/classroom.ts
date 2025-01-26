import { Classroom } from '@/api/classroom.js'
import { getOrganizationAppInstallations } from '@/api/org.js'
import { appID, appInstallationLink } from '@/utils/config/config.js'
import chalk from 'chalk'

export async function isAppInstalled(classroom: Classroom) {
    const apps = await getOrganizationAppInstallations(classroom.organization.login)

    if (!apps || apps.findIndex(app => app.app_id == appID) == -1) {
        console.log(chalk.yellow(`The Dugit GitHub App is not installed on ${classroom.name}. Please visit ${chalk.cyan(appInstallationLink)}`))
        return false
    }

    return true
}
