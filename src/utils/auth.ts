import { exit } from '@oclif/core/errors'
import axios from 'axios'

function sleep(seconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

export async function requestDeviceCode() {
    const response = await axios.post('https://github.com/login/device/code', {},
        {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                'client_id': 'Iv23lijtn2t2viXRUXCe',
            },
        },
    )

    return response.data
}

export async function requestToken(deviceCode: string) {
    const response = await axios.post('https://github.com/login/oauth/access_token', {},
        {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                'client_id': 'Iv23lijtn2t2viXRUXCe',
                'device_code': deviceCode,
                'grant_type': 'urn:ietf:params:oauth:grant-type:device_code',
            },
        },
    )

    return response.data
}

export async function pollForToken(deviceCode: string, interval: number) {
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

export async function login() {
    const response = await requestDeviceCode()

    console.log(`Please visit ${response.verification_uri}\nand enter code: ${response.user_code}`)

    const accessToken = await pollForToken(response.device_code, response.interval)

    console.log(`Access token: ${accessToken}`)
}
