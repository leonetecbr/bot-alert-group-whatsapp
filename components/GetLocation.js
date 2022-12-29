import {curly} from 'node-libcurl'

export async function getLocation(url) {
    const {statusCode, headers} = await curly.get(url, {
        'SSL_VERIFYHOST': false,
        'SSL_VERIFYPEER': false
    })

    return (statusCode === 302) ? headers[0].Location : false
}

export default getLocation