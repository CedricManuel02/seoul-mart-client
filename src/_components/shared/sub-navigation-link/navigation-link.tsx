import Link from 'next/link'
import React from 'react'

export default function NavigationLink({text, link} : { text: string, link: string}) {
  return (
    <Link href={link} className="text-slate-500 font-normal">{text}</Link>
  )
}
