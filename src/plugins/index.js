import { registerMerchant } from './merchant'
import { registerAdmin } from './admin'

export default async function registerPlugins(ctx) {
  const { isMerchant } = ctx
  if (isMerchant) {
    await registerMerchant(ctx)
  } else {
    await registerAdmin(ctx)
  }
  return ctx
}
