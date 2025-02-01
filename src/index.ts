#!/usr/bin/env node

import { startup } from '@/utils/startup/startup.js'
import { prompts } from '@/prompts/prompts.js'

async function main() {
    await startup()
    await prompts()
}

main().then(() => {})
