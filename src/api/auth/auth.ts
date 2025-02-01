import axios from 'axios'

import { clientID } from '@/utils/config/config.js'

export async function requestDeviceCode() {
    return (await axios.post('https://github.com/login/device/code', {},
        {
            headers: { 'Accept': 'application/json' },
            params: { 'client_id': clientID },
        },
    )).data
}

export async function requestToken(deviceCode: string) {
    return (await axios.post('https://github.com/login/oauth/access_token', {},
        {
            headers: { 'Accept': 'application/json' },
            params: {
                'client_id': clientID,
                'device_code': deviceCode,
                'grant_type': 'urn:ietf:params:oauth:grant-type:device_code',
            },
        },
    )).data
}
