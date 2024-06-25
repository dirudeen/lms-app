import { fetchCourse } from "@/actions/course"

interface Props {
    params:{
        courseId: string
    }
}


export default async function CoursePage({params: {courseId}}: Props) {
  const course = await fetchCourse(courseId)

  // fields to complete
  const requiredFields = [course.title, course.description, course.imageUrl, course.categoryId]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields} / ${totalFields}`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
        </div>
      </div>
    </div>
  )
}
