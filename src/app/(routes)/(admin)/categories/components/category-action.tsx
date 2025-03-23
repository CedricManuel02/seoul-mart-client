import React from 'react'

export default function CategoryAction({children} : any) {
    return (
        <div className="flex w-full space-y-2 flex-col items-center justify-center md:flex-row md:space-x-2 md:space-y-0">
            {children}
        </div>
    )
}
