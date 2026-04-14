import { Sidebar, SidebarHeader, SidebarGroup, SidebarContent } from '@monorepo/ui/components/sidebar'
import React from 'react'

const AppSidebar = ({
    children,
}: {
    children: React.ReactNode
}) => {
  return (
    <Sidebar>
        <SidebarHeader>

        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                {children}
                
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar