const platform = process.env.VUE_APP_APP_PLATFORM

const isMerchant = process.env.VUE_APP_APP_PLATFORM === 'MERCHANT'
const isAdmin = !isMerchant

export { platform, isMerchant, isAdmin }
