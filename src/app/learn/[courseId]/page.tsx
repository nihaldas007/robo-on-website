import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CoursePlayerClient from "@/components/course-pages/CoursePlayerClient";

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const q = query(collection(db, "courses"), where("status", "==", "Published"));
    const querySnapshot = await getDocs(q);
    const paths = querySnapshot.docs.map(doc => ({
      courseId: doc.id,
    }));
    return paths.length > 0 ? paths : [{ courseId: 'default' }];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ courseId: 'default' }];
  }
}

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  await params;
  return <CoursePlayerClient />;
}
