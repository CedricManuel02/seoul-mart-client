import { DEFAULT_ICON_SIZE } from '@/_constant/constant'
import { LoaderCircle } from 'lucide-react'
import React from 'react'

export default function ButtonLoading({text} : {text: string}) {
  return (
    <div className="flex items-center justify-center space-x-4">
        <LoaderCircle className="animate-spin" size={DEFAULT_ICON_SIZE}/>
        <p>{text}</p>
    </div>
  )
}
