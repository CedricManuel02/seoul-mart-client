import React from 'react'
import DashboardCard from './dashboard-card'
import { getDashboardAnalyticsServerAction } from '@/_action/(admin)/dashboard';

export default async function DashboardCards() {
    const response = await getDashboardAnalyticsServerAction();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-4">
            {response.map((data: any, index: number) => (
                <DashboardCard key={index} background={data.background} count={data.count} title={data.title} percentage={data.percentage} different={data.different} />
            ))}
        </div>
    )
}
