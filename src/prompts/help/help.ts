import chalk from 'chalk'
import { repoLink } from '@/utils/config/config.js'

export function help() {
    console.log('View usage guide at ' + chalk.cyan(repoLink + '?tab=readme-ov-file#usage'))
}
