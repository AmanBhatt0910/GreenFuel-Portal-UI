import React from 'react'
import DashboardProvider from './Provider'

interface LayoutProps{
  children : React.ReactNode
}

const layout = ({children} : LayoutProps) => {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

export default layout