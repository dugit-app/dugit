import prompts from '@/prompts/prompts.js'
import utils from '@/utils/utils.js'

async function main() {
    await utils.startup()
    await prompts.prompts()
}

main().then(() => {})
