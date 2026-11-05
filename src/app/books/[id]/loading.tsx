
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <LoadingSpinner
        message="Loading book details..."
        fullScreen
      />
    </main>
  );
}
