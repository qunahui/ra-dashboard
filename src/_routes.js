import React from 'react'
import { Redirect } from 'react-router-dom'
const LoginView = React.lazy(() => import('./views/LoginView'))
const RegisterView = React.lazy(() => import('./views/RegisterView'))
const DashboardView = React.lazy(() => import('./views/DashboardView'))

const routes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: DashboardView,
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
