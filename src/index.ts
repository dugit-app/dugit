#!/usr/bin/env node

import { prompts } from '@/prompts/prompts.js'
import { startup } from '@/utils/startup/startup.js'

await startup()
await prompts()
