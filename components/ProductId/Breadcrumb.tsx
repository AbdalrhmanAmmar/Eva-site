import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronLeft className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-sm font-medium text-primary">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}