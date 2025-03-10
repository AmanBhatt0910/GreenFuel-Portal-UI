import React from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  [x: string]: any;
}

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
  items,
  ...props
}) => (
  <nav className="flex" aria-label="Breadcrumb" {...props}>
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          <a
            href={item.href}
            className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  </nav>
); 