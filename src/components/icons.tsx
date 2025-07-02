export function NexchatLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    >
      <path
        d="M20 30 L50 60 L80 30"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M20 70 L50 40 L80 70"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      />
    </svg>
  );
}
