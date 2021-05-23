import React, { ReactElement } from 'react'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import Image from 'next/image'

import { Jumbotron, Card, Page, Heading } from '../../components'

import metadata from '../../../metadata.yaml'
import { Tag } from 'metadata.yaml'

import styles from '../../styles/list.module.css'
import { getAllArticlesMetadata } from 'src/lib/article-path'

interface TagProps {
  tags: {
    articleCount: number
    name: string
    blurb: string
    image: {
      lqip: string
      url: string
    }
  }[]
}

const Tags = ({ tags }: TagProps): ReactElement => {
  console.log(tags)
  return (
    <>
      <Heading title={'Tags'} />
      <Page>
        <div>
          <Jumbotron
            width={'100vw'}
            height={'60vh'}
            background={
              <div className="w-full h-full bg-white dark:bg-black" />
            }
            foreground={
              <div className="text-white h-full w-full flex flex-col justify-center text-center">
                <h1 className="text-4xl">Tags</h1>
              </div>
            }
          />

          <div className="px-5 py-12 -mt-32 mb-24 max-w-5xl mx-auto grid gap-7">
            {tags.map((tag, i) => {
              return i % 2 == 0 ? (
                <Card key={tag.name}>
                  <div className="h-32 flex items-center flex-col justify-start md:flex-row">
                    <div className="h-full w-72 relative overflow-hidden md:rounded-l-lg rounded-t-lg md:rounded-tr-none">
                      <Link href={'/tags/[tagId]'} as={`/tags/${tag.name}`}>
                        <a className="w-full md:w-60 h-full">
                          <Image
                            objectFit="cover"
                            objectPosition="center"
                            layout="fill"
                            src={`/images/tags/${tag.image.src}`}
                            alt={`${tag.name} tag`}
                            className="transform-gpu hover:scale-125 border-4 border-white flex-shrink-0 transition ease-in-out duration-500 filter grayscale-custom hover:grayscale-0"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="relative mx-4">
                      <div className="justify-center flex-wrap flex items-center md:justify-start">
                        <h1 className={`${styles.heading} text-2xl`}>
                          <Link href={'/tags/[tagId]'} as={`/tags/${tag.name}`}>
                            <a>{tag.name}</a>
                          </Link>
                        </h1>
                      </div>
                      <p>{tag.blurb}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card key={tag.name}>
                  <div className="h-32 flex items-center flex-col justify-start md:flex-row-reverse">
                    <div className="h-full w-72 relative overflow-hidden md:rounded-r-lg rounded-t-lg md:rounded-tl-none">
                      <Link href={'/tags/[tagId]'} as={`/tags/${tag.name}`}>
                        <a className="w-full md:w-60 h-full">
                          <Image
                            objectFit="cover"
                            objectPosition="center"
                            layout="fill"
                            src={`/images/tags/${tag.image.src}`}
                            alt={`${tag.name} tag`}
                            className="transform-gpu hover:scale-125 border-4 border-white flex-shrink-0 transition ease-in-out duration-500 filter grayscale-custom hover:grayscale-0"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="relative mx-4">
                      <div className="justify-center flex-wrap flex items-center md:justify-end">
                        <h1 className={`${styles.heading} text-2xl`}>
                          <Link href={'/tags/[tagId]'} as={`/tags/${tag.name}`}>
                            <a>{tag.name}</a>
                          </Link>
                        </h1>
                      </div>
                      <p>{tag.blurb}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </Page>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const tags = new Map<string, number>()
  const articles = await getAllArticlesMetadata()
  if (!Array.isArray(metadata.tags)) return { props: { tags: [] } }
  const tagsCounted = metadata?.tags.map((tag: Tag) => ({
    ...tag,
    // image: (await import(`src/assets/images/tags/${tag.image.src}`)).default,
    articleCount: articles.reduce((acc, article) => {
      return acc + (article.tags.includes(tag.name) ? 1 : 0)
    }, 0),
  }))

  return { props: { tags: tagsCounted } }
}

export default Tags
