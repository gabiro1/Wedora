export default function WedoraLogo({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="currentColor" className="text-muted-gold" />
      <path d="M8 12L14 28L20 18L26 28L32 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
