import { getRepoFile } from '@/api/repo/repo.js'
import { isLoggedIn, login } from '@/utils/auth/auth.js'
import { version } from '@/utils/config/config.js'
import chalk from 'chalk'
import { exit } from 'node:process'
import ora, { Ora } from 'ora'
import { simpleGit } from 'simple-git'

export async function startup() {
    const spinner = ora().start()
    await checkGitInstalled(spinner)
    await checkUpdate(spinner)
    await checkLoggedIn(spinner)
    spinner.stop()
}

async function checkGitInstalled(spinner: Ora) {
    const gitInstalled = (await simpleGit().version()).installed

    if (!gitInstalled) {
        spinner.stop()
        console.log(chalk.yellow('Git is not installed on this system. Please install Git in order to use Dugit'))
        exit()
    }
}

async function checkUpdate(spinner: Ora) {
    const latestVersion = (await getRepoFile('dugit-app', 'package.json', 'dugit')).version
    const installedVersion = version

    if (installedVersion != latestVersion) {
        spinner.stop()
        console.log(`Dugit update available ${chalk.yellow(installedVersion)} -> ${chalk.green(latestVersion)}`)
        console.log(`Run ${chalk.underline('npm update -g dugit')} to update\n`)
        spinner.start()
    }
}

async function checkLoggedIn(spinner: Ora) {
    if (!await isLoggedIn()) {
        spinner.stop()
        console.log('You need to authenticate with GitHub to use Dugit\n')
        await login()
    }
}
