import chalk from 'chalk'
import { repoLink } from '@/utils/config/config.js'

export function usage() {
    console.log('View usage guide at ' + chalk.cyan(repoLink + '#readme'))
}
