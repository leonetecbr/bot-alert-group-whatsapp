const getLocation = require('./GetLocation')

module.exports = async (link, storeId) => {
    const url = 'https://www.awin1.com/cread.php?awinmid=' + storeId + '&awinaffid=' + process.env.AWIN_ID + '&ued=' + encodeURI(link)

    return await getLocation(url)
}