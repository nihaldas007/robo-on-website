import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CourseDetailsClient from "@/components/course-pages/CourseDetailsClient";

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const q = query(collection(db, "courses"), where("status", "==", "Published"));
    const querySnapshot = await getDocs(q);
    const paths = querySnapshot.docs.map(doc => ({
      id: doc.id,
    }));
    return paths.length > 0 ? paths : [{ id: 'default' }];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: 'default' }];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <CourseDetailsClient />;
}
