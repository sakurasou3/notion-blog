import { Client } from "@notionhq/client";

export type MetaData = {
  id: number;
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: Array<string>;
};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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
  });

  return getPageMetaData(response.results[0]);
};
