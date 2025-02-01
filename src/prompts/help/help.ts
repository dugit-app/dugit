import { repoLink } from '@/utils/config/config.js'
import chalk from 'chalk'

export function help() {
    console.log('View usage guide at ' + chalk.cyan(repoLink + '?tab=readme-ov-file#usage'))
}
