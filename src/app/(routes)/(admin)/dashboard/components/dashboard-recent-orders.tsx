import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function DashboardRecentOrders() {
    return (
        <Card className="rounded-md bg-white shadow-sm min-h-44 h-full px-4 w-full">
            <header className="flex items-center justify-between py-4 px-2 border-b">
                <h4 className="text-slate-700 text-sm font-medium">Recent Orders</h4>
                <Link href={"/orders"} className="text-slate-500 text-sm hover:text-green-500">See all</Link>
            </header>
            <div className="pb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Link href={"/"} key={index} className="flex items-center justify-between gap-2 px-4 py-2 rounded-md hover:bg-slate-100">
                        <div className="flex items-center gap-2">
                            <p className="text-slate-500 text-sm">{index + 1}</p>
                            <Image className="rounded" src={"http://res.cloudinary.com/dbhtfe2rv/image/upload/v1742377406/products/xugiba4nilfys2uru1ox.jpg"} alt="Product" width={40} height={40} />
                            <div>
                                <h4 className="font-normal text-sm text-slate-700">Banana Milk</h4>
                                <small className="text-slate-500">Drinks</small>
                            </div>
                        </div>
                        <p className="font-normal text-slate-700 text-sm">$30.00</p>
                    </Link>
                ))}
            </div>
        </Card>
    )
}
