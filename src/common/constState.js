
var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'http://www.chaquanzhong.com' :
    'http://116.62.18.166:8090';
    console.log(process.env.NODE_ENV)
    console.log(process.env.ASSET_PATH)
var LOCAL_VERSION = '1.0.7'
export {
    BASE_URL,
    LOCAL_VERSION
}