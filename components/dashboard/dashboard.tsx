"use client";
import { DashboardPropType } from '@/utils/types';
import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation';
import { AppShell } from '@mantine/core';
import useAuthRedux from '@/utils/auth';


const DashboardProvider = ({ children }: DashboardPropType) => {
    const auth = useAuthRedux();
    const navigate = useRouter();
    if(!auth.isAuthenticaion){
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <React.Fragment>
            <AppShell>
                <AppShell.Header>
                    Dashboard here...
                </AppShell.Header>
            </AppShell>
        </React.Fragment>
    )
}

export default DashboardProvider;
