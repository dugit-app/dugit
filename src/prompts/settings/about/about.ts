import { repoLink, version } from '@/utils/config/config.js'
import chalk from 'chalk'

export function about() {
    console.log(`Github Classroom tools for Drury University`)
    console.log(`Version: ${version}`)
    console.log('Author: Brayden O\'Neal')
    console.log('License: GPL-3.0')
    console.log('Homepage: ' + chalk.cyan(repoLink))
}
