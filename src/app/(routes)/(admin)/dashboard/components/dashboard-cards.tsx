import React from 'react'
import DashboardCard from './dashboard-card'

export default function DashboardCards() {
    const cards = [{
        count: "$500,234",
        title: "Revenue",
        background: true,
        percentage: "+10%",
        different: true
    }, {
        count: "350",
        title: "Customers",
        background: false,
        percentage: "-2%",
        different: false
    }, {
        count: "140",
        title: "Orders",
        background: true,
        percentage: "+23%",
        different: true
    }]
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 pb-4">
            {cards.map((card, index) => (
                <DashboardCard key={index} background={card.background} count={card.count} title={card.title} percentage={card.percentage} different={card.different} />
            ))}
        </div>
    )
}
