import { requestDeviceCode, requestToken } from '@/api/auth/auth.js'
import { readConfigFile, writeConfigFile } from '@/utils/config/file/file.js'
import chalk from 'chalk'
import { exit } from 'node:process'

function sleep(seconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
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
            exit()
        }

        return pollForToken(deviceCode, interval)
    }

    return response.access_token
}

export async function getAccessToken() {
    const { accessToken } = await readConfigFile()

    return accessToken
}

export async function tokenizeURL(URL: string) {
    return `https://oauth2:${await getAccessToken()}@${URL.slice(8)}`
}

export async function isLoggedIn() {
    const accessToken = await getAccessToken()

    return accessToken !== '' && accessToken !== undefined
}

export async function login() {
    const response = await requestDeviceCode()

    console.log(`Please visit ${chalk.cyan(response.verification_uri)}\nand enter code: ${response.user_code}`)

    const accessToken = await pollForToken(response.device_code, response.interval)

    const configFile = await readConfigFile()
    configFile.accessToken = accessToken

    await writeConfigFile(configFile)

    console.log('\nSuccessfully authenticated!')
}

export async function logout() {
    const configFile = await readConfigFile()

    if (Object.hasOwn(configFile, 'accessToken')) {
        delete configFile.accessToken
    }

    await writeConfigFile(configFile)
}
