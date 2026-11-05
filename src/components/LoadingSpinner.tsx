interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-[70vh]" : "py-12"
      }`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#dce5dc] border-t-[#174c3c]" />

      <p className="text-sm font-medium text-gray-500">
        {message}
      </p>
    </div>
  );
}
