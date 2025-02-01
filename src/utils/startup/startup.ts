import { getRepoFile } from '@/api/repo/repo.js'
import { isLoggedIn, login } from '@/utils/auth/auth.js'
import { version } from '@/utils/config/config.js'
import chalk from 'chalk'
import ora from 'ora'
import { simpleGit } from 'simple-git'

export async function startup() {
    const spinner = ora().start()
    await checkGitInstalled()
    await checkUpdate()
    await checkLoggedIn()
    spinner.stop()
}

async function checkGitInstalled() {
    const gitInstalled = (await simpleGit().version()).installed

    if (!gitInstalled) {
        console.log(chalk.yellow('Git is not installed on this system. Please install Git in order to use Dugit'))
        process.exit(0)
    }
}

async function checkUpdate() {
    const latestVersion = (await getRepoFile('dugit-app', 'package.json', 'dugit')).version
    const installedVersion = version

    if (installedVersion != latestVersion) {
        console.log(`Dugit update available ${chalk.yellow(installedVersion)} -> ${chalk.green(latestVersion)}`)
        console.log(`Run ${chalk.underline('npm update -g dugit')} to update\n`)
    }
}

async function checkLoggedIn() {
    if (!await isLoggedIn()) {
        console.log('You need to authenticate with GitHub to use Dugit\n')
        await login()
    }
}
