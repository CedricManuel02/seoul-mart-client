import React from 'react'
import DashboardBarcharts from './dashboard-barchart'
import { Card } from '@/components/ui/card'

export default function DashboardChart() {
    return (
        <Card className="shadow-sm min-h-44 h-auto px-4 rounded-md bg-white py-4 w-full flex flex-col justify-between items-start">
            <header className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="text-slate-700 text-sm font-medium">Yearly Sales</h4>
                    <small className="text-slate-500">January - December {" "}
                        {new Date().getFullYear()}
                    </small>
                </div>
            </header>
            <div className="w-full">
                <DashboardBarcharts />
            </div>
        </Card>
    )
}
