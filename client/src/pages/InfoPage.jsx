import { Link } from 'react-router-dom';
import { infoPages } from '../config/content.js';
import { useSeo } from '../lib/useSeo.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import NotFound from './NotFound.jsx';

export default function InfoPage({ slug }) {
  const page = infoPages[slug];

  useSeo({ title: page?.title, description: page?.lead });

  if (!page) return <NotFound />;

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: page.title }]} />

      <div className="mt-5 max-w-3xl">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1 className="h1 mt-3">{page.title}</h1>
        {page.lead ? <p className="lede mt-3">{page.lead}</p> : null}

        <p className="mt-4 rounded-soft border border-beige/70 bg-cream/60 px-3.5 py-2.5 text-[11px] leading-6 text-muted">
          این متن یک نسخه پیش‌نویس است و باید با محتوای نهایی تأییدشده فروشگاه جایگزین شود.
        </p>

        {page.table ? (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-center text-[12.5px]">
              <caption className="mb-2 text-start text-[11px] text-muted">{page.table.caption}</caption>
              <thead>
                <tr className="bg-cream">
                  {page.table.head.map((cell) => (
                    <th key={cell} scope="col" className="border border-line px-3 py-2.5 font-medium text-ink">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell} className="num border border-line px-3 py-2.5 text-muted">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {page.faq ? (
          <div className="mt-8 divide-y divide-line border-y border-line">
            {page.faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-medium text-ink">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-2xl text-[12.5px] leading-7 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        ) : null}

        {page.sections?.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="h2">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[13px] leading-7 text-muted">
                {paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className="mt-3 space-y-2">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-7 text-muted">
                    <span className="mt-2.5 block h-1 w-1 shrink-0 rounded-full bg-beige" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-outline btn-sm">
            مشاهده محصولات
          </Link>
          <Link to="/contact" className="btn btn-light btn-sm">
            تماس با ما
          </Link>
        </div>
      </div>
    </div>
  );
}
