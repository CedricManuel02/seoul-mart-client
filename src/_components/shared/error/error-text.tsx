import React from 'react'

export default function ErrorText({text} : {text: string}) {
  return (
    <p className="text-red-500 text-sm mt-2">
      {text}
    </p>
  )
}
