import { simpleGit } from 'simple-git'
import chalk from 'chalk'

import { getRepositoryFile } from '@/api/repository.js'
import config from '@/utils/config.js'
import utils from '@/utils/utils.js'

export default async function startup() {
    await checkGitInstalled()
    await checkUpdate()
    await checkLoggedIn()
}

async function checkGitInstalled() {
    const gitInstalled = (await simpleGit().version()).installed

    if (!gitInstalled) {
        console.log(chalk.yellow('Git is not installed on this system. Please install Git in order to use Dugit'))
        process.exit(0)
    }
}

async function checkUpdate() {
    const latestVersion = (await getRepositoryFile('braydenoneal', 'package.json', 'dugit')).version
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
        console.clear()
    }
}
