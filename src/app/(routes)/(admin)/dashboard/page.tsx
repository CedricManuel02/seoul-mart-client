import React from 'react'
import DashboardChart from './components/dashboard-chart'
import DashboardTopSelling from './components/dashboard-top-selling'
import DashboardRecentOrders from './components/dashboard-recent-orders'
import DashboardHeader from './components/dashboard-header'
import DashboardCards from './components/dashboard-cards'

export default function Dashboard() {
    return (
        <div className="bg-white w-full h-full">
            <div className=" w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-5">
                <DashboardHeader/>
                <div className="flex flex-col items-stretch lg:flex-row justify-between gap-2">
                    <div className="w-full">
                        <DashboardCards/>
                        <DashboardChart />
                    </div>
                    <aside className="flex flex-col w-full items-stretch gap-2 lg:w-5/12">
                        <DashboardTopSelling />
                        <DashboardRecentOrders/>
                    </aside>
                </div>
            </div>
        </div>
    )
}
