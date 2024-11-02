import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))

const Spinners = React.lazy(() => import('./ui/spinners/Spinners'))

const Appointment = React.lazy(() => import('./features/appointment/Appointments'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/appointments', name: 'Appointments', element: Appointment },
  // { path: '/categories', name: 'Categories', element: Category },
]

export default routes
