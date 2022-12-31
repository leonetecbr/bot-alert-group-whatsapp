import {curly} from 'node-libcurl'
import processURL from './ProcessURL.js'

export async function processPelando(url) {
    const {data} = await curly.get(url, {
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
    })
    const matches = [... data.matchAll(/"sourceUrl":"([-\w@:%.\\+~#?&/=]+)"/g)]

    if (matches.length === 0) return false
    return await processURL(matches[0][1])
}

export default processPelando