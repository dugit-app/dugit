import { select as inquirerSelect, Separator, input as inquirerInput } from '@inquirer/prompts'
import chalk from 'chalk'

type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

export async function select<Value>(config: {
    message: string,
    choices: readonly (string | Separator)[] | readonly (Separator | Choice<Value>)[],
    noOptionsMessage?: string
}) {
    const { message, choices, noOptionsMessage } = config

    if (choices.length == 0) {
        console.log(chalk.yellow(noOptionsMessage || 'No options exist'))
        return
    }

    return inquirerSelect({ message, choices }, { clearPromptOnDone: true })
}

export async function input(message: string, defaultValue?: string) {
    return await inquirerInput({ message, default: defaultValue }, { clearPromptOnDone: true })
}
