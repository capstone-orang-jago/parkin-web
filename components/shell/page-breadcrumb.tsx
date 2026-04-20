import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-megalit-600">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="contents">
            {i > 0 ? (
              <span className="px-1 text-megalit-400" aria-hidden>
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-bomba-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bomba-500"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-megalit-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
