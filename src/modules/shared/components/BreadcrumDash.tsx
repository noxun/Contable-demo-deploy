import Link from "next/link";

interface Item {
  label: string;
  href: string
}

export const BreadcrumbDashboard = ({ items }: { items: Item[] }) => {

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 lg:gap-2 pb-2">
        {items.map((segment, index) => {
          return (
            <li key={index}>
              <div className="flex items-center">
                {index === 0 && (
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                )}
                {index > 0 && (
                  <>
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </>
                )}
                <Link
                  href={segment.href}
                  className={`ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white }`}
                >
                  {segment.label}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}