import React from 'react'
import { Redirect } from 'react-router-dom'
const LoginView = React.lazy(() => import('./views/AuthView/LoginView'))
const RegisterView = React.lazy(() => import('./views/AuthView/RegisterView'))
const ForgotPassword = React.lazy(() => import('Components/ForgotPassword'))
const ChangePassword = React.lazy(() => import('Components/ChangePassword'))
const DashboardView = React.lazy(() => import('./views/DashboardView'))
const ConfigView = React.lazy(() => import('./views/ConfigView'))
//
const ChannelCreateView = React.lazy(() => import('./views/ChannelCreateView'))
const ChannelCreateSuccessView = React.lazy(() => import('./views/ChannelCreateView/success'))
const SendoAuth = React.lazy(() => import('./views/ChannelCreateView/SendoAuth'))
const LazadaConnectStep = React.lazy(() => import('./views/ChannelCreateView/LazadaConnectStep'))
const LazadaFinishStep = React.lazy(() => import('./views/ChannelCreateView/LazadaFinishStep'))
//
const MarketplaceProductView = React.lazy(() => import('./views/MarketplaceView/MarketplaceProductView'))
const CreateMarketplaceProductView = React.lazy(() => import('./views/MarketplaceView/create'))
const MarketplaceOrderView = React.lazy(() => import('./views/MarketplaceOrderView/MarketplaceOrderView'))
const SingleMarketplaceOrderView = React.lazy(() => import('./views/MarketplaceOrderView/SingleMarketplaceOrderView'))
//
const ProductView = React.lazy(() => import('./views/ProductView'))
const AllVariantView = React.lazy(() => import('./views/ProductView/AllVariantView'))
const SingleProductView = React.lazy(() => import('./views/ProductView/SingleProduct'))
const SingleVariantView = React.lazy(() => import('./views/ProductView/SingleVariant'))
const CreateProductView = React.lazy(() => import('./views/CreateProductView'))
//
const PurchaseOrderView = React.lazy(() => import('./views/PurchaseOrderView'))
const PurchaseOrderCreateView = React.lazy(() => import('./views/PurchaseOrderView/create'))
const SinglePurchaseOrderView = React.lazy(() => import('./views/PurchaseOrderView/SinglePurchaseOrderView'))
//
const RefundOrderView = React.lazy(() => import('./views/RefundOrderView'))
const RefundOrderCreateView = React.lazy(() => import('./views/RefundOrderView/create'))
const SingleRefundOrderView = React.lazy(() => import('./views/RefundOrderView/SingleRefundOrderView'))
//
const SupplierRefundOrderView = React.lazy(() => import('./views/SupplierRefundOrderView'))
const SupplierRefundOrderCreateView = React.lazy(() => import('./views/SupplierRefundOrderView/create'))
const SingleSupplierRefundOrderView = React.lazy(() => import('./views/SupplierRefundOrderView/SingleSupplierRefundOrderView'))
//
const OrderView = React.lazy(() => import('./views/OrderView'))
const OrderCreateView = React.lazy(() => import('./views/OrderView/create'))
const SingleOrderView = React.lazy(() => import('./views/OrderView/SingleOrderView'))
//
const SupplierView = React.lazy(() => import('./views/SupplierView'))
const SingleSupplierView = React.lazy(() => import('./views/SupplierView/SingleSupplierView'))
//
const NotConnected = React.lazy(() => import('../src/components/NotConnected'))


const routes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    rolesAccess: [''],
  },
  {
    path: '/app/create/sendo',
    name: 'Authenticate sendo credentials',
    component: SendoAuth,
    rolesAccess: [''],
  },
  {
    path: '/app/create/lazada',
    exact: true,
    name: 'Finish authenticate lazada credentials',
    component: LazadaConnectStep,
    rolesAccess: [''],
  },
  {
    path: '/app/create/lazada/finish',
    exact: true,
    name: 'Finish authenticate lazada credentials',
    component: LazadaFinishStep,
    rolesAccess: [''],
  },
  {
    path: '/app/create/success',
    name: 'sale channel create success',
    component: ChannelCreateSuccessView,
    rolesAccess: [''],
  },
  {
    path: '/app/create',
    name: 'Create sale channel',
    component: ChannelCreateView,
    rolesAccess: [''],
  },
  {
    path: '/app/config',
    name: 'App config',
    component: ConfigView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/market_place/products/create',
    name: 'CreateMarketplaceProductView',
    exact: true,
    component: CreateMarketplaceProductView,
    rolesAccess: [''],
  },
  {
    path: '/app/market_place/products',
    name: 'MarketplaceProductView',
    component: MarketplaceProductView,
    rolesAccess: [''],
  },
  {
    path: '/app/market_place/orders/:id',
    name: 'SingleMarketplaceOrderView',
    component: SingleMarketplaceOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/market_place/orders',
    name: 'MarketplaceOrderView',
    component: MarketplaceOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/products/create',
    name: 'Create new product',
    component: CreateProductView,
    rolesAccess: [''],
  },
  {
    path: '/app/products',
    name: 'All products',
    component: ProductView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/products/variants',
    name: 'All products',
    component: AllVariantView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/product/:id',
    name: 'Single product view',
    component: SingleProductView,
    rolesAccess: [''],
    exact: true
  },
  {
    path: '/app/product/:id/variant/:variantId',
    name: 'Single variant view',
    component: SingleVariantView,
    rolesAccess: ['']
  },
  {
    path: '/app/products/purchase_orders/create',
    name: 'Purchase Orders create',
    component: PurchaseOrderCreateView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/products/purchase_orders/:id',
    name: 'Single Purchase Order View',
    component: SinglePurchaseOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/products/purchase_orders',
    name: 'Purchase Orders View',
    component: PurchaseOrderView,
    rolesAccess: ['']
  },
  {
    path: '/app/orders/refund/create',
    name: 'Refund Orders create',
    component: RefundOrderCreateView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/orders/refund/:id',
    name: 'Single Refund Order View',
    component: SingleRefundOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/orders/refund',
    name: 'Refund Orders View',
    component: RefundOrderView,
    rolesAccess: ['']
  },
  {
    path: '/app/products/supplier_refund_orders/create',
    name: 'SupplierRefund Orders create',
    component: SupplierRefundOrderCreateView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/products/supplier_refund_orders/:id',
    name: 'Single Supplier Refund Order View',
    component: SingleSupplierRefundOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/products/supplier_refund_orders',
    name: 'Supplier Refund Orders View',
    component: SupplierRefundOrderView,
    rolesAccess: ['']
  },
  {
    path: '/app/orders/create',
    name: 'Orders create',
    component: OrderCreateView,
    rolesAccess: [''],
    exact: true,
  },
  {
    path: '/app/orders/:id',
    name: 'Single Order View',
    component: SingleOrderView,
    rolesAccess: [''],
  },
  {
    path: '/app/orders',
    name: 'Orders View',
    component: OrderView,
    rolesAccess: ['']
  },
  {
    path: '/app/products/suppliers/:id',
    name: 'Supplier info View',
    component: SingleSupplierView,
    rolesAccess: ['']
  },
  {
    path: '/app/products/suppliers',
    name: 'Suppliers View',
    component: SupplierView,
    rolesAccess: ['']
  },
  {
    path: '/app/not-connected',
    name: 'Not connected',
    component: NotConnected,
    rolesAccess: ['']
  }
]

const authRoutes = [
  {
    path: '/login',
    name: 'auth login',
    component: LoginView,
    rolesAccess: [''],
  },
  {
    path: '/register',
    name: 'auth register',
    component: RegisterView,
    rolesAccess: [''],
  },
  {
    path: '/forgot',
    name: 'forgot password',  
    rolesAccess: [''],  
    component: ForgotPassword
  },
  {
    path: '/change-password',
    name: 'change password',  
    rolesAccess: [''],  
    component: ChangePassword
  },
  {
    path: '/',
    name: 'Redirect',
    component: Redirect,
    componentProps: {
      to: '/app/dashboard',
    },
    rolesAccess: [''],
  },
]

export { routes, authRoutes }
