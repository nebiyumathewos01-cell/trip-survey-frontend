export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg">
      <div className="h-60 skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-6 skeleton rounded-lg w-3/4" />
        <div className="h-4 skeleton rounded-lg w-full" />
        <div className="h-4 skeleton rounded-lg w-5/6" />
        <div className="h-4 skeleton rounded-lg w-4/6" />
        <div className="h-12 skeleton rounded-xl mt-2" />
      </div>
    </div>
  )
}
