import { simpleGit } from 'simple-git'
import chalk from 'chalk'

import { getRepoFile } from '@/api/repo.js'
import config from '@/utils/config/config.js'
import utils from '@/utils/utils.js'
import ora from 'ora'

export default async function startup() {
    const spinner = ora('Checking for git installation').start()
    await checkGitInstalled()

    spinner.text = 'Checking for update'
    await checkUpdate()

    spinner.text = 'Checking for authentication'
    await checkLoggedIn()

    spinner.stop()
    console.clear()
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
    const installedVersion = config.version

    if (installedVersion != latestVersion) {
        console.log(`Dugit update available ${chalk.yellow(installedVersion)} -> ${chalk.green(latestVersion)}`)
        console.log(`Run ${chalk.underline('npm update -g dugit')} to update\n`)
    }
}

async function checkLoggedIn() {
    if (!await utils.auth.isLoggedIn()) {
        console.log('You need to authenticate with GitHub to use Dugit\n')
        await utils.auth.login()
    }
}
