import { MetaData } from "@/lib/notionApi";
import Link from "next/link";
import React from "react";

type Props = MetaData & {
  isPaginationPage?: boolean;
};

export const SinglePost = (props: Props) => {
  const { title, description, date, tags, slug } = props;
  return (
    <Link href={`/posts/${slug}`}>
      {props.isPaginationPage === true ? (
        <section className="border border-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="lg:flex items-center">
            <h2 className="text-black text-2xl font-medium mb-2">{title}</h2>
            <div className="text-gray-400 mr-2">{date}</div>
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-white bg-sky-900 rounded-full px-2 py-1 font-medium mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-black">{description}</p>
        </section>
      ) : (
        <section className="lg:w-1/2 border border-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-gray-black text-2xl font-medium mb-2">
              {title}
            </h2>
            <div className="text-gray-black">{date}</div>
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-white bg-sky-900 rounded-full px-2 py-1 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-black">{description}</p>
        </section>
      )}
    </Link>
  );
};
