import { Link } from 'react-router-dom';

export default function SectionHeader({ eyebrow, title, description, action, align = 'start' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start';
  return (
    <div
      className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${
        align === 'center' ? 'md:flex-col md:items-center' : ''
      }`}
    >
      <div className={`flex flex-col ${alignment}`}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h1 mt-3">{title}</h2>
        {description ? <p className="lede mt-3 max-w-xl">{description}</p> : null}
      </div>
      {action ? (
        <Link
          to={action.to}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink"
        >
          {action.label}
          <span
            aria-hidden="true"
            className="block h-px w-6 bg-beige transition-all duration-200 group-hover:w-9 group-hover:bg-ink"
          />
        </Link>
      ) : null}
    </div>
  );
}
