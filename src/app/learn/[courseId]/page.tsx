export const dynamic = 'force-static';
import CoursePlayerClient from "@/components/course-pages/CoursePlayerClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ courseId: 'default' }];
}

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  await params;
  return <CoursePlayerClient />;
}
