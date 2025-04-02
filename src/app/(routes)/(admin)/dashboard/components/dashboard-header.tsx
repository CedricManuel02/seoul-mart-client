import Custom404 from '@/app/not-found';
import { auth } from '@/auth'
import React from 'react'

export default async function DashboardHeader() {
    const session = await auth();

    if(!session) return <Custom404/>

    return (
        <div className="h-24 flex flex-col justify-center items-start">
            <h2 className="text-slate-700 font-semibold text-md lg:text-xl">
                Dashboard
            </h2>
            <p className="text-slate-500 text-sm">Hello Welcome {session?.user.name}!</p>
        </div>
    )
}
