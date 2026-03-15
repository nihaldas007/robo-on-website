export const dynamic = 'force-static';
import CourseDetailsClient from "@/components/course-pages/CourseDetailsClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: 'default' }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <CourseDetailsClient />;
}
