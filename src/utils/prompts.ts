import { select, Separator } from '@inquirer/prompts'
import { ValidationError } from '@inquirer/core'
import chalk from 'chalk'

type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

export default async function selectOptions<Value>(config: {
    message: string,
    choices: readonly (string | Separator)[] | readonly (Separator | Choice<Value>)[],
    noOptionsMessage?: string
}) {
    const { message, choices, noOptionsMessage } = config

    if (choices.length == 0) {
        console.log(chalk.yellow(noOptionsMessage || 'No options exist'))
        return
    }

    return select({ message, choices }, { clearPromptOnDone: true })
}
