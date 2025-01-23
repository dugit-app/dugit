import { simpleGit } from 'simple-git'
import chalk from 'chalk'
import { getRepositoryFile } from './api/repository.js'
import config from './utils/config.js'
import utils from './utils/utils.js'
import { prompts } from './prompts/prompts.js'

// Check if git is installed
// TODO: Test if this check works on a system without git installed
const gitInstalled = (await simpleGit().version()).installed

if (!gitInstalled) {
    console.log(chalk.yellow('Git is not installed on this system. Please install Git in order to use Dugit'))
    process.exit(0)
}

// Check for update
const latestVersion = (await getRepositoryFile('braydenoneal', 'package.json', 'dugit')).version
const installedVersion = config.version

if (installedVersion != latestVersion) {
    console.log(`Dugit update available ${chalk.gray(installedVersion)} -> ${chalk.green(latestVersion)}`)
    console.log(`Run ${chalk.cyan('npm update -g dugit')} to update\n`)
}

// Check if logged in
if (!await utils.auth.isLoggedIn()) {
    console.log('You need to authenticate with GitHub to use Dugit\n')
    await utils.auth.login()
}

await prompts()
