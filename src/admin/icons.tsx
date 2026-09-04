interface IconProps {
  className?: string;
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 8l8.5-4.5L20.5 8v8L12 20.5 3.5 16V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3.5 8L12 12.5 20.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="12" y1="12.5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="15 8 20 12 15 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TicketIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 9a2 2 0 012-2h14a2 2 0 012 2v1.5a1.5 1.5 0 000 3V15a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.5a1.5 1.5 0 000-3V9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="14.5" y1="7.5" x2="14.5" y2="16.5" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2.2 2.2" />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="14" x2="20" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8h3.2l1.2-2h7.2l1.2 2H20a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
