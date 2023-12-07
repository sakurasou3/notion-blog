import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export type MetaData = {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: Array<string>;
};

const POST_SLICE_NUM = 4;

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    page_size: 100,
  });
  return posts.results.map((post) => getPageMetaData(post));
};

const getPageMetaData = (post: any): MetaData => ({
  id: post.id,
  title: post.properties.Name.title[0].plain_text,
  description: post.properties.Description.rich_text[0].plain_text,
  date: post.properties.Date.date.start,
  slug: post.properties.Slug.rich_text[0].plain_text,
  tags: post.properties.Tags.multi_select.map((t: { name: string }) => t.name),
});

export const getSinglePost = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });
  const metaData = getPageMetaData(response.results[0]);

  // 本文をマークダウン形式で取得
  const mdBlocks = await n2m.pageToMarkdown(metaData.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  return { ...metaData, markdown: mdString.parent };
};

/** TOPページ用記事の取得（4つ） */
export const getPostsForTopPage = async () =>
  (await getAllPosts()).slice(0, POST_SLICE_NUM);

/** ページ番号に応じた記事取得 */
export const getPostsByPage = async (page: number) =>
  (await getAllPosts()).slice(
    (page - 1) * POST_SLICE_NUM,
    page * POST_SLICE_NUM
  );

/** ページネーション数を取得 */
export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts();
  const div = Math.floor(allPosts.length / POST_SLICE_NUM);
  const mod = allPosts.length % POST_SLICE_NUM;
  if (mod === 0) {
    return div;
  }
  return div + 1;
};
