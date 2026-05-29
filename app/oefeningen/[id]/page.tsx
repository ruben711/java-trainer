import { notFound } from "next/navigation";
import ExerciseRunner from "@/components/ExerciseRunner";
import { getAllExercises, getExercise } from "@/lib/exercises";

export function generateStaticParams() {
  return getAllExercises().map((e) => ({ id: e.id }));
}

export default function ExercisePage({ params }: { params: { id: string } }) {
  const exercise = getExercise(params.id);
  if (!exercise) notFound();
  return <ExerciseRunner exercise={exercise} />;
}
