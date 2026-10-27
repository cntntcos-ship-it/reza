const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const IconSearch = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

export const IconUser = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6" />
  </svg>
);

export const IconHeart = ({ filled = false, ...props }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M12 20s-7.2-4.4-7.2-9.3A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.2 3.1C19.2 15.6 12 20 12 20Z" />
  </svg>
);

export const IconBag = (props) => (
  <svg {...base} {...props}>
    <path d="M5.5 8h13l-1 12h-11l-1-12Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const IconArrowLeft = (props) => (
  <svg {...base} {...props}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const IconChevronLeft = (props) => (
  <svg {...base} {...props}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg {...base} {...props}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const IconClose = (props) => (
  <svg {...base} {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconPlus = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (props) => (
  <svg {...base} {...props}>
    <path d="M4.5 7h15M9.5 7V5.5h5V7M7 7l.8 12h8.4L17 7" />
    <path d="M10.5 11v4.5M13.5 11v4.5" />
  </svg>
);

export const IconStar = ({ filled = true, ...props }) => (
  <svg {...base} width={12} height={12} fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} {...props}>
    <path d="m12 4.5 2.3 4.7 5.2.7-3.8 3.6.9 5.1-4.6-2.5-4.6 2.5.9-5.1L4.5 9.9l5.2-.7L12 4.5Z" />
  </svg>
);

export const IconCheck = (props) => (
  <svg {...base} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconTruck = (props) => (
  <svg {...base} {...props}>
    <path d="M3 7h10v9H3z" />
    <path d="M13 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const IconReturn = (props) => (
  <svg {...base} {...props}>
    <path d="M4 9a8 8 0 1 1-1 5" />
    <path d="M4 4v5h5" />
  </svg>
);

export const IconShield = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4l7 2.5v5.8c0 4-3 7-7 8.2-4-1.2-7-4.2-7-8.2V6.5L12 4Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconSupport = (props) => (
  <svg {...base} {...props}>
    <path d="M5 13v-2a7 7 0 0 1 14 0v2" />
    <path d="M5 13h2.5v5H6a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 6 13Z" />
    <path d="M19 13h-2.5v5H18a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 18 13Z" />
  </svg>
);

export const IconFilter = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M7 12h10M10 17h4" />
  </svg>
);

export const IconMail = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
);

export const IconInstagram = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = (props) => (
  <svg {...base} {...props}>
    <path d="M14.5 8.5h2V5.8h-2c-1.9 0-3 1.2-3 3.1v1.6H9.5v2.7h2V20h2.8v-6.8h2.2l.4-2.7h-2.6V9.2c0-.5.2-.7.7-.7Z" />
  </svg>
);

export const IconPinterest = (props) => (
  <svg {...base} {...props}>
    <path d="M9.5 20c.6-1.7 1.1-3.4 1.6-5.2" />
    <path d="M8.6 13.4c-1-2.4.2-5.2 2.9-6 2.6-.8 5 .6 5.3 3 .3 2.5-1 4.9-3.2 5.2-1.3.2-2.2-.5-2.3-1.4" />
    <circle cx="12" cy="12" r="8.5" />
  </svg>
);

export const IconTiktok = (props) => (
  <svg {...base} {...props}>
    <path d="M14 4.5v8.9a3.6 3.6 0 1 1-3.2-3.6" />
    <path d="M14 4.5c.4 2.2 1.9 3.6 4 3.8" />
  </svg>
);

export const SOCIAL_ICONS = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  pinterest: IconPinterest,
  tiktok: IconTiktok,
};
