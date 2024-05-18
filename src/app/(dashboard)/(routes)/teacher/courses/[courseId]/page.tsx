interface Props {
    params:{
        courseId: string
    }
}

export default function CoursePage({params: {courseId}}: Props) {
  return (
    <div>Course detail page of id {courseId}</div>
  )
}
