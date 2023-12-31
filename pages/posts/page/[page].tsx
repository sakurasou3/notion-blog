import { Pagination } from '@/components/Pagination/Pagination';
import { SinglePost } from '@/components/Post/SinglePost';
import { Tag } from '@/components/Tag/Tag';
import {
  MetaData,
  getAllTags,
  getNumberOfPages,
  getPostsByPage,
} from '@/lib/notionApi';
import Head from 'next/head';

export const getStaticPaths = async () => {
  const page = await getNumberOfPages();
  const paths = new Array(page).map(p => ({
    params: {
      page: p,
    },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

// SSG(ISR)の設定
// build時にデータを全てレンダリング→その後60sに一度レンダリングし直し、最新に保つ
// (参考)https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export async function getStaticProps({ params }: { params: { page: number } }) {
  const allPosts = await getPostsByPage(params.page);
  const numberOfPages = await getNumberOfPages();
  const allTags = await getAllTags();
  return {
    props: {
      allPosts,
      allTags,
      currentPage: Number(params.page),
      numberOfPages,
    },
    revalidate: 60,
  };
}

type Props = {
  allPosts: MetaData[];
  allTags: Array<string>;
  currentPage: number;
  numberOfPages: number;
};
export default function BlogPageList({
  allPosts,
  allTags,
  currentPage,
  numberOfPages,
}: Props) {
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
          {allPosts.map((post: MetaData, index: number) => (
            <div key={index}>
              <SinglePost {...post} isPaginationPage />
            </div>
          ))}
        </section>
        <Pagination numberOfPages={numberOfPages} currentPage={currentPage} />
      </main>
      <Tag tags={allTags} />
    </div>
  );
}
