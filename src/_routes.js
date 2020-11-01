import React from 'react'
import { Redirect } from 'react-router-dom'
const LoginView = React.lazy(() => import('./views/LoginView'))
const DashboardView = React.lazy(() => import('./views/DashboardView'))
const SendoDashboardView = React.lazy(() => import('./views/SendoDashboardView'))
const CustomerListView = React.lazy(() => import('./views/CustomerListView'))

const routes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    rolesAccess: [''],
  },
  {
    path: '/app/customers',
    name: 'Dashboard',
    component: CustomerListView,
    rolesAccess: [''],
  },
  {
    path: '/app/sendo/dashboard',
    name: 'SendoDashboard',
    component: SendoDashboardView,
    rolesAccess: [''],
  },
]

const authRoutes = [
  {
    path: '/login',
    name: 'auth login',
    component: LoginView,
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