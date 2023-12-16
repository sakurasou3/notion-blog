import { Pagination } from '@/components/Pagination/Pagination';
import { SinglePost } from '@/components/Post/SinglePost';
import {
  MetaData,
  getAllTags,
  getNumberOfPagesByTag,
  getPostsByTagAndPage,
} from '@/lib/notionApi';
import Head from 'next/head';

export const getStaticPaths = async () => {
  const allTags = await getAllTags();
  const paths = await Promise.all(
    allTags.flatMap(async tag => {
      const numberOfPageByTag = await getNumberOfPagesByTag(tag);
      return [...Array(numberOfPageByTag)].flatMap((_, p) => {
        return {
          params: {
            tag: tag,
            page: (p + 1).toString(),
          },
        };
      });
    }),
  );
  console.error(JSON.stringify(paths.flat()));
  return {
    paths: paths.flat(),
    fallback: 'blocking',
  };
};

export async function getStaticProps(context: {
  params: { tag: string; page: string };
}) {
  const currentPage = Number(context.params?.page ?? 1);
  const currentTag = context.params?.tag.toString();
  const posts = await getPostsByTagAndPage(currentTag, currentPage);
  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
}

type Props = {
  posts: MetaData[];
  numberOfPages: number;
};
export default function BlogTagPageList({ posts, numberOfPages }: Props) {
  return (
    <div className="container w-full h-full mx-auto">
      <Head>
        <title>Notion Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {posts.map((post: MetaData, index: number) => (
            <div key={index}>
              <SinglePost {...post} isPaginationPage />
            </div>
          ))}
        </section>
        <Pagination numberOfPages={numberOfPages} />
      </main>
    </div>
  );
}
