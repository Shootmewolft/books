const PLACEHOLDER_COUNT = 10;

export function CatalogueSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-12">
      <div className="h-11 w-full max-w-xl animate-pulse rounded-card bg-deep" />
      <div className="h-32 w-full animate-pulse rounded-card bg-deep/60" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => index).map((index) => (
          <div key={index} className="aspect-[1/1.42] animate-pulse rounded-card bg-deep" />
        ))}
      </div>
    </div>
  );
}
