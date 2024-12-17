import React from 'react'
import { ReactNode } from 'react'

export default function FormCard({children, className}: {children: ReactNode, className?: string}) {
  return (
    <div
    className={`bg-slate-100 p-4 mt-6 rounded-md border shadow-sm ${className}`}
    >{children}</div>
  )
}
