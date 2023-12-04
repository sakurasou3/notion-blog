import { MetaData, getSinglePost } from "@/lib/notionApi";
import React from "react";

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: "first-post" } },
      { params: { slug: "second-post" } },
      { params: { slug: "third-post" } },
    ],
    fallback: "blocking", // falseだと404が表示される
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = await getSinglePost(params.slug);
  return { props: { post }, revalidate: 60 };
};

export default function Post({ post }: { post: MetaData }) {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{post.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">{post.date}</span>
      <br />
      {post.tags.map((tag) => (
        <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 mr-2 px-2 inline-block">
          {tag}
        </p>
      ))}
      <div className="mt-10 font-medium">body</div>
    </section>
  );
}
