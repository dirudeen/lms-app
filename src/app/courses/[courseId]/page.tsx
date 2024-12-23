import React from 'react'

interface PageProps {
    params: {
        courseId: string;
    }
}

export default function Page({ params }: PageProps) {
   const courseId = params.courseId;
  return (
    <div>{courseId}</div>
  )
}
