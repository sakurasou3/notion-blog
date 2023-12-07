import Link from "next/link";
import React from "react";

type Props = {
  numberOfPages: number;
};
export const Pagination = (props: Props) => {
  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justify-center gap-4">
        {[...Array(props.numberOfPages)].map((_, index) => {
          const i = index + 1;
          return (
            <li
              key={index}
              className="bg-sky-900 rounded-full w-8 h-8 relative"
            >
              <Link
                href={`/posts/page/${i}`}
                className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100 text-sm"
              >
                {i}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
