import { createRouter as createAdminRouter } from './admin'
import { createRouter as createMerchantRouter } from './merchant'
import { isMerchant } from '../env'

export async function createRouter(_ctx) {
  const router = isMerchant
    ? await createMerchantRouter(_ctx)
    : await createAdminRouter(_ctx)
  return router
}
