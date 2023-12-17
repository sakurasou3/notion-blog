import Link from 'next/link';
import React from 'react';

type Props = {
  currentPage: number;
  numberOfPages: number;
  tag?: string;
};
export const Pagination = (props: Props) => {
  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justify-center gap-4">
        {[...Array(props.numberOfPages)].map((_, index) => {
          const i = index + 1;
          const active = i === props.currentPage;
          const pageLink = props.tag
            ? `/posts/tag/${props.tag}/${i}`
            : `/posts/page/${i}`;
          return (
            <li
              key={index}
              className={`${
                active ? 'border-sky-900' : 'bg-sky-900'
              } border-2 rounded-full w-8 h-8 relative`}>
              <Link
                href={pageLink}
                className={`absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 ${
                  active ? 'text-gray-black' : 'text-gray-100'
                } text-sm`}>
                {i}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
