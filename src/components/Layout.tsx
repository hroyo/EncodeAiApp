import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ProfileMenu from '@repo/auth/ProfileMenu'; // Import ProfileMenu component

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
    return (
        <DashboardLayout
            defaultSidebarCollapsed
            // sx={{
            //     '& .MuiDrawer-root .MuiDrawer-paper': {
            //         width: '250px',  // Customize the width without `!important`
            //     },
            // }}
            slots={{
                toolbarActions: ProfileMenu, // ProfileMenu component as account info
            }}
        >            <PageContainer>{props.children}</PageContainer>
        </DashboardLayout>
    );
}