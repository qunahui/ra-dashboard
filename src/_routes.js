import React from 'react'
import { Redirect } from 'react-router-dom'
const LoginView = React.lazy(() => import('./views/LoginView'))
const RegisterView = React.lazy(() => import('./views/RegisterView'))
const DashboardView = React.lazy(() => import('./views/DashboardView'))
const CustomerListView = React.lazy(() => import('./views/CustomerListView'))
const ConfigView = React.lazy(() => import('./views/ConfigView'))
//
const ChannelCreateView = React.lazy(() => import('./views/ChannelCreateView'))
const ChannelCreateSuccessView = React.lazy(() => import('./views/ChannelCreateView/success'))
const SendoAuth = React.lazy(() => import('./views/ChannelCreateView/SendoAuth'))
const LazadaAuth = React.lazy(() => import('./views/ChannelCreateView/LazadaAuth'))
//

const routes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    rolesAccess: [''],
  },
  {
    path: '/app/customers',
    name: 'Customers',
    component: CustomerListView,
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
    name: 'Authenticate lazada credentials',
    component: LazadaAuth,
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
