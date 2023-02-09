import { serialize } from 'next-mdx-remote/serialize'

import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkSlug from 'remark-slug'
import remarkMath from 'remark-math'
import remarkGFM from 'remark-gfm'

import rehypeLqip from '@/lib/rehype-lqip-plugin'
import rehypeTOC from '@/lib/rehype-toc-plugin'

import { getArticleMetadata, getArticles } from '@/lib/article-path'

import type { Metadata } from 'types/metadata'

import { Revue, Article, AuthorCardLeft, MDXContent } from '@/components/index'

import metadata from '#/metadata.yaml'

import { lqip } from '@/lib/shrink'
import { join } from 'path'
import { copyFile, mkdir, readdir, readFile } from 'fs/promises'

export async function generateMetadata({
  params,
}: {
  params: { articleId: string }
}) {
  const articleId = params.articleId
  const articleMetadata = await getArticleMetadata(articleId)

  return {
    title: `${articleMetadata.title} | Kochie Engineering`,
    description: articleMetadata.blurb,
    openGraph: {
      url: `https://${
        process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_VERCEL_URL
      }/articles/${articleMetadata.articleDir}`,
      title: `${articleMetadata.title} | Kochie Engineering`,
      description: articleMetadata.blurb,
      article: {
        publishedTime: articleMetadata.publishedDate,
        modifiedTime: articleMetadata?.editedDate || '',
        tags: articleMetadata.tags,
        authors: [
          `https://${
            process.env.NEXT_PUBLIC_PROD_URL ||
            process.env.NEXT_PUBLIC_VERCEL_URL
          }/authors/${articleMetadata.author}`,
        ],
      },
      images: [
        {
          url: encodeURI(
            `https://${
              process.env.NEXT_PUBLIC_PROD_URL ||
              process.env.NEXT_PUBLIC_VERCEL_URL
            }/api/og?title=${articleMetadata.title}&author=${
              articleMetadata.author
            }&imageUrl=${articleMetadata.jumbotron.url}`
          ),
          alt: articleMetadata.jumbotron.alt,
        },
      ],
      siteName: 'Kochie Engineering',
    },
  }
}

const ArticlePage = async ({ params }: { params: { articleId: string } }) => {
  const articleId = params.articleId
  const articleMetadata = await getArticleMetadata(articleId)

  const files = await readdir(`articles/${articleMetadata.articleDir}`)
  await mkdir(`public/images/articles/${articleMetadata.articleDir}`, {
    recursive: true,
  })
  for (const file of files) {
    if (
      file.endsWith('.png') ||
      file.endsWith('.jpg') ||
      file.endsWith('.jpeg') ||
      file.endsWith('.gif') ||
      file.endsWith('.svg')
    ) {
      await copyFile(
        `articles/${articleMetadata.articleDir}/${file}`,
        `public/images/articles/${articleMetadata.articleDir}/${file}`
      )
    }
  }

  let author = (metadata as Metadata).authors?.[articleMetadata.author] || ''
  const lqipString = await lqip(
    join(process.env.PWD || '', '/public/images/authors', author.avatar.src)
  )
  author = { ...author, avatar: { src: author.avatar.src, lqip: lqipString } }

  const mdxSource = await serialize(
    (await readFile(articleMetadata.path)).toString(),
    {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkSlug, remarkGFM],
        rehypePlugins: [
          rehypeTOC,
          rehypeKatex,
          rehypeLqip(articleMetadata.articleDir),
          rehypeSlug,
        ],
      },
    }
  )

  const imageUrl = new URL(
    `https://${
      process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_VERCEL_URL
    }/api/og`
  )

  imageUrl.searchParams.set(
    'author',
    encodeURIComponent(articleMetadata.author)
  )
  imageUrl.searchParams.set(
    'imageUrl',
    encodeURIComponent(articleMetadata.jumbotron.url)
  )
  imageUrl.searchParams.set('title', encodeURIComponent(articleMetadata.title))

  return (
    <>
      <Article article={articleMetadata} author={author}>
        <MDXContent compiledSource={mdxSource.compiledSource} />
      </Article>
      <AuthorCardLeft author={author} />
      <Revue />
    </>
  )
}

export default ArticlePage

export const generateStaticParams = async () => {
  const articles = await getArticles()
  return articles.map((article) => ({
    articleId: article,
  }))
}
