import { exit } from '@oclif/core/errors'
import axios from 'axios'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { appName, clientID, configDirectoryPath, configFilePath } from './config.js'

type ConfigFile = {
    accessToken?: string
}

function sleep(seconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

async function readConfigFile(): Promise<ConfigFile> {
    return JSON.parse(await readFile(configFilePath, 'utf8'))
}

async function writeConfigFile(data: ConfigFile) {
    await writeFile(configFilePath, JSON.stringify(data), 'utf8')
}

async function createConfigFile() {
    await writeConfigFile({})
}

async function requestDeviceCode() {
    const response = await axios.post('https://github.com/login/device/code', {},
        {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                'client_id': clientID,
            },
        },
    )

    return response.data
}

async function requestToken(deviceCode: string) {
    const response = await axios.post('https://github.com/login/oauth/access_token', {},
        {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                'client_id': clientID,
                'device_code': deviceCode,
                'grant_type': 'urn:ietf:params:oauth:grant-type:device_code',
            },
        },
    )

    return response.data
}

async function pollForToken(deviceCode: string, interval: number) {
    await sleep(interval)

    const response = await requestToken(deviceCode)

    if (Object.hasOwn(response, 'error')) {
        const { error } = response

        let terminate = false

        switch (error) {
            case 'slow_down': {
                await sleep(5)

                break
            }

            case 'expired_token': {
                console.log('The device code has expired. Please try again.')
                terminate = true

                break
            }

            case 'access_denied': {
                console.log('Login cancelled by the user.')
                terminate = true

                break
            }
        }

        if (terminate) {
            exit(1)
        }

        return pollForToken(deviceCode, interval)
    }

    return response.access_token
}

export async function getAccessToken() {
    await mkdir(configDirectoryPath, { recursive: true })

    if (existsSync(configFilePath)) {
        const configFile = await readConfigFile()

        if (Object.hasOwn(configFile, 'accessToken')) {
            return configFile.accessToken
        }
    } else {
        await createConfigFile()
    }

    console.log(`Please run \`${appName} auth login\` to authenticate with GitHub.`)
    exit(1)
}

export async function login() {
    const response = await requestDeviceCode()

    console.log(`Please visit ${response.verification_uri}\nand enter code: ${response.user_code}`)

    const accessToken = await pollForToken(response.device_code, response.interval)

    const configFile = await readConfigFile()
    configFile.accessToken = accessToken

    await writeConfigFile(configFile)

    console.log('Successfully authenticated!')
}

export async function logout() {
    const configFile = await readConfigFile()

    if (Object.hasOwn(configFile, 'accessToken')) {
        delete configFile.accessToken
    }

    await writeConfigFile(configFile)
}
