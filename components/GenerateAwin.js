import getLocation from './GetLocation.js'

export async function generateAwin(link, storeId) {
    const awinId = (storeId >= 22193 && storeId <= 22195) ? process.env.AWIN_ID_B2W : process.env.AWIN_ID
    const url = 'https://www.awin1.com/cread.php?awinmid=' + storeId + '&awinaffid=' + awinId + '&ued=' + encodeURI(link)

    return await getLocation(url)
}

export default generateAwin