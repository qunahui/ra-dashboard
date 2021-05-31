import { all, fork, takeLatest } from 'redux-saga/effects'
import { AppSaga } from 'Redux/app'
import { UserSaga } from 'Redux/user'
import { ProductSaga } from 'Redux/product'
import { SendoProductSaga } from 'Redux/sendoProduct'
import { LazadaProductSaga } from 'Redux/lazadaProduct'
import { PlatformSaga } from 'Redux/platform'
import { SupplierSaga } from 'Redux/supplier'
import { PurchaseOrderSaga } from 'Redux/purchaseOrder'
import { RefundOrderSaga } from 'Redux/refundOrder'
import { SupplierRefundOrderSaga } from 'Redux/supplierRefundOrder'
import { OrderSaga } from 'Redux/order'
import { CustomerSaga } from 'Redux/customer'

export default function* root() {
  const sagas = [
    ...UserSaga, 
    ...AppSaga, 
    ...ProductSaga, 
    ...SendoProductSaga, 
    ...LazadaProductSaga, 
    ...PlatformSaga, 
    ...SupplierSaga, 
    ...PurchaseOrderSaga, 
    ...RefundOrderSaga, 
    ...SupplierRefundOrderSaga, 
    ...OrderSaga,
    ...CustomerSaga,
  ]
  yield all(sagas)
  return sagas
}

