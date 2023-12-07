import { PostBody } from "@/components/Post/PostBody";
import { MetaData, getAllPosts, getSinglePost } from "@/lib/notionApi";
import Link from "next/link";
import React from "react";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
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

export default function Post({
  post,
}: {
  post: MetaData & { markdown: string };
}) {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{post.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">{`投稿日 ${post.date}`}</span>
      <br />
      {post.tags?.map((tag, index) => (
        <p
          key={index}
          className="text-white bg-sky-900 rounded-full font-medium mt-2 mr-2 px-2 py-1 inline-block"
        >
          {tag}
        </p>
      ))}
      <PostBody body={post.markdown} />
      <Link href="/">
        <span className="py-10 block mt-3 text-sky-900">←ホームに戻る</span>
      </Link>
    </section>
  );
}
