import { getCoursePurchase } from '@/actions/purchase'
import { Chapter, Course, UserProgress } from '@/types'
import React from 'react'
import CourseSidebarItem from './courseSidebarItem'

type CourseSidebarProps = {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    } 
    progressCount: number
}

export default async function CourseSidebar({course, progressCount}: CourseSidebarProps) {
    const purchase = await getCoursePurchase({courseId: course.id})
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
    <div className='p-8 flex flex-col border-b'>
        <h1 className='font-semibold'>{course.title}</h1>
    </div>
    <div className="flex flex-col w-full">
        {course.chapters.map(chapter => (
            <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
            />
        ))}
    </div>
    </div>
  )
}
