import React from 'react'

import style from '@/styles/tags.module.css'
import { ArticleMetadata, getAllArticlesMetadata } from '@/lib/article-path'
import type { Tag } from 'types/metadata'

import metadata from '../../../../metadata.yaml'
import { ArticleCards, Gallery, Jumbotron } from '@/components'

const { Small, Medium } = ArticleCards
import { Metadata as NextMetadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { tagId: string }
}): Promise<NextMetadata> {
  const tagName = params.tagId.replace(/^\w/, (c) => c.toUpperCase())
  return {
    title: tagName,
    alternates: {
      canonical: `https://${
        process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_VERCEL_URL
      }/tags/${params.tagId}`,
    },
    openGraph: {
      title: `${tagName} | Kochie Engineering`,
      url: `https://${
        process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_VERCEL_URL
      }/tags/${params.tagId}`,
    },
  }
}

async function tagLookup(tags: string | string[], articles: ArticleMetadata[]) {
  if (Array.isArray(tags)) {
    const taggedArticles = articles.filter((article) =>
      article.tags.find((tag: string) => tags.includes(tag))
    )

    const image = (metadata.tags as Tag[]).find((tag) => tag.name == tags[0])
      ?.image || { src: '' }

    const lf = new Intl.ListFormat('en', {
      localeMatcher: 'best fit',
      type: 'conjunction',
      style: 'long',
    })

    return { taggedArticles, tags: lf.format(tags), image }
  } else {
    const taggedArticles = await Promise.all(
      articles.filter((article) => article.tags.includes(tags))
    )
    const image = (metadata.tags as Tag[]).find((tag) => tag.name == tags)
      ?.image || { src: '' }
    return { taggedArticles, tags, image }
  }
}

const TagComponent = async ({ params }: { params: { tagId: string } }) => {
  const articles = await getAllArticlesMetadata()

  const tags = params.tagId

  const { taggedArticles, tags: tagString } = await tagLookup(tags, articles)

  const tagDesc = metadata.tags.find((t: Tag) => t.name === tags)?.blurb

  return (
    <>
      <Jumbotron
        height={'80vh'}
        width={'100vw'}
        background={<div className="bg-black w-full h-full" />}
        foreground={
          <div className="text-center relative h-full flex flex-col justify-center text-white">
            <h1 className="text-4xl mb-6 capitalize">{tagString}</h1>
            <span>{`A collection of ${taggedArticles.length} ${
              taggedArticles.length > 1 ? 'posts' : 'post'
            }.`}</span>
            <hr className={style.hr} />
            <div className={style.desc}>
              <p>{tagDesc}</p>
            </div>
          </div>
        }
      />
      <div className="relative -mt-32">
        <Gallery
          backgroundColor="transparent"
          cardOrder={[Small, Small, Small, Medium, Medium]}
          articles={taggedArticles}
        />
      </div>
    </>
  )
}

export const generateStaticParams = async () => {
  if (!Array.isArray(metadata.tags)) return []
  return metadata.tags.map((tag: Tag) => ({
    tagId: tag.name,
  }))
}

export default TagComponent
