import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'


import history from './utils/history'
import { reducer as User } from 'Redux/user'
import { reducer as App } from 'Redux/app'
import { reducer as Product } from 'Redux/product'
import { reducer as SendoProduct } from 'Redux/sendoProduct'
import { reducer as LazadaProduct } from 'Redux/lazadaProduct'
import { reducer as Platform } from 'Redux/platform'
import { reducer as PurchaseOrder } from 'Redux/purchaseOrder'
import { reducer as SupplierRefundOrder } from 'Redux/supplierRefundOrder'
import { reducer as RefundOrder } from 'Redux/refundOrder'
import { reducer as Order } from 'Redux/order'
import { reducer as Customer } from 'Redux/customer'
import { reducer as Supplier } from 'Redux/supplier'

export default (injectedReducers = {}) =>
  connectRouter(history)(
    combineReducers({
      auth: User,
      app: App,
      product: Product,
      sendoProduct: SendoProduct,
      lazadaProduct: LazadaProduct,
      supplier: Supplier,
      platform: Platform,
      purchaseOrder: PurchaseOrder,
      refundOrder: RefundOrder,
      supplierRefundOrder: SupplierRefundOrder,
      order: Order,
      customer: Customer,
      router: connectRouter(history),
      ...injectedReducers,
    }),
  )
