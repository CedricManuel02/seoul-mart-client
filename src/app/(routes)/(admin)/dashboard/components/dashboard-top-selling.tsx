import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function DashboardTopSelling() {
    return (
        <Card className="rounded-md bg-white shadow-sm min-h-44 h-full px-4 w-full">
            <header className="flex items-center justify-between py-4 px-2 border-b">
                <h4 className="text-slate-700 text-sm font-medium">Top Selling Products</h4>
                <Link href={"/products"} className="text-slate-500 text-sm hover:text-green-500">See all</Link>
            </header>
            <div className="pb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Link href={"/product"} key={index}className="flex items-center justify-start gap-2 px-4 py-2 rounded-md hover:bg-slate-100">
                        <p className="text-slate-500 text-sm">{index + 1}</p>
                        <Image className="rounded" src={"http://res.cloudinary.com/dbhtfe2rv/image/upload/v1742377406/products/xugiba4nilfys2uru1ox.jpg"} alt="Product" width={40} height={40} />
                        <div>
                            <h4 className="font-medium text-sm text-slate-700">Banana Milk</h4>
                            <small className="text-slate-500">$45.00</small>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    )
}
