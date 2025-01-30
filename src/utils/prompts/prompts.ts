import {
    select as inquirerSelect,
    checkbox as inquirerCheckbox,
    input as inquirerInput,
    confirm as inquirerConfirm,
    Separator,
} from '@inquirer/prompts'
import chalk from 'chalk'

export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

class BackOption {
}

export async function select<Value>(config: {
    message: string,
    choices: (Separator | Choice<Value>)[],
    noOptionsMessage?: string,
    hideBackOption?: boolean,
}) {
    const { message, choices, noOptionsMessage, hideBackOption } = config

    if (choices.length == 0) {
        console.log(chalk.yellow(noOptionsMessage || 'No options exist'))
        return
    }

    if (hideBackOption) {
        return inquirerSelect({ message, choices, pageSize: choices.length }, { clearPromptOnDone: true })
    }

    const choicesWithBackOptions: (Separator | Choice<Value | BackOption>)[] = [
        ...choices,
        ...[
            new Separator(),
            { name: 'Back', value: new BackOption() },
        ],
    ]

    const option = await inquirerSelect({
        message,
        choices: choicesWithBackOptions,
        pageSize: choicesWithBackOptions.length,
    }, { clearPromptOnDone: true })

    if (option instanceof BackOption) {
        return
    }

    return option
}

export async function checkbox<Value>(config: {
    message: string,
    choices: readonly (string | Separator)[] | readonly (Separator | Choice<Value>)[],
    noOptionsMessage?: string
}) {
    const { message, choices, noOptionsMessage } = config

    if (choices.length == 0) {
        console.log(chalk.yellow(noOptionsMessage || 'No options exist'))
        return
    }

    return inquirerCheckbox({ message, choices }, { clearPromptOnDone: true })
}

export async function input(message: string, defaultValue?: string) {
    return await inquirerInput({ message, default: defaultValue }, { clearPromptOnDone: true })
}

export async function confirm(message: string) {
    return await inquirerConfirm({ message, default: false }, { clearPromptOnDone: true })
}
