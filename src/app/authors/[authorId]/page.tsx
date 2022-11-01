import React from 'react'
// import Error from 'next/error'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { GetStaticPaths } from 'next'
import Image from 'next/legacy/image'
// import * as Fathom from 'fathom-client'

// import styles from '../../styles/author.module.css'
// import Heading from '@/components/Heading'
// import Page from '@/components/Page'
import Jumbotron from '@/components/Jumbotron'
import Gallery from '@/components/Gallery'
import Card from '@/components/Card'
import { lqip } from '@/lib/shrink'
import {
  // ArticleMetadata,
  getAllArticlesMetadata,
} from '@/lib/article-path'

import metadata from '../../../../metadata.yaml'
import { join } from 'path'
// import { NextSeo } from 'next-seo'

import {
  Author,
  // SocialMedia
} from 'types/metadata'
import SMButton from '@/components/SocialMediaButtons'
import Error from '../error'
import { GetStaticPaths } from 'next'

const AuthorPage = async ({ params }: { params: { authorId: string } }) => {
  const articles = await getAllArticlesMetadata()
  const authorUsername = params.authorId

  const authoredArticles = articles.filter(
    (article) => article.author === authorUsername
  )

  const authorDetails = Object.values<Author>(metadata.authors).find(
    (author) => author.username === authorUsername
  )

  if (!authorDetails) {
    return (
      <Error error={{ name: '404', message: `${authorUsername} not found` }} />
    )
  }

  authorDetails.avatar.lqip = await lqip(
    join(
      process.env.PWD || '',
      '/public/images/authors',
      authorDetails.avatar.src
    )
  )

  return (
    <>
      {/* <Heading title={`${authorDetails.fullName}'s Articles`} /> */}
      {/* <NextSeo
        title={`${authorDetails.fullName} | Kochie Engineering`}
        description={authorDetails.bio}
        openGraph={{
          url: `https://${
            process.env.NEXT_PUBLIC_PROD_URL ||
            process.env.NEXT_PUBLIC_VERCEL_URL
          }/authors/${authorDetails.username}`,
          title: `${authorDetails.fullName} | Kochie Engineering`,
          description: authorDetails.bio,
          images: [
            {
              url: `https://${
                process.env.NEXT_PUBLIC_PROD_URL ||
                process.env.NEXT_PUBLIC_VERCEL_URL
              }/_next/image?url=/images/authors/${
                authorDetails.avatar.src
              }&w=640&q=75`,
              alt: authorDetails.username,
            },
          ],
          site_name: 'Kochie Engineering',
        }}
        twitter={{
          handle: '@kochie',
          site: '@kochie',
          cardType: 'summary_large_image',
        }}
      /> */}
      <div className="">
        <Jumbotron
          width={'100vw'}
          height={'70vh'}
          background={<div className="h-full bg-black" />}
          foreground={
            <div className="top-11 text-white flex h-full text-center flex-col justify-center items-center">
              <div className="cursor-pointer w-32 h-32 mb-8 rounded-full border-4 border-white border-solid transform-gpu hover:scale-125 ease-in-out duration-200 filter grayscale-70 hover:grayscale-0 hover:border-yellow-400 overflow-hidden">
                <Image
                  layout="fill"
                  src={`/images/authors/${authorDetails.avatar.src}`}
                  alt={`${authorDetails.fullName} Avatar`}
                  blurDataURL={authorDetails.avatar.lqip || ''}
                  placeholder="blur"
                  className="rounded-full mb-2"
                />
              </div>
              <h1 className="mb-4 mt-1 text-3xl">{authorDetails.fullName}</h1>
              <span className="mb-4">{`${authoredArticles.length} articles`}</span>
              <div className="flex flex-row justify-center mt-1">
                {authorDetails.socialMedia.map((sm) => (
                  <SMButton sm={sm} key={sm.name} />
                ))}
              </div>
              <hr className="w-28 mx-auto my-6" />
              <div className="max-w-xs">{authorDetails.bio}</div>
            </div>
          }
        />
      </div>

      {authoredArticles.length > 0 ? (
        <div className="-mt-16">
          <Gallery articles={authoredArticles} />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto -mt-8 mb-8">
          <Card>
            <div className="p-12">
              <p className="text-xl mb-4">Hmm...</p>
              <p>
                {`It looks like ${authorDetails.username} hasn't written
                    anything yet.`}
              </p>
              <p className="mt-2">Come back later for some juicy content.</p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const articles = await getAllArticlesMetadata()
//   const authorUsername = params?.authorId

//   const authoredArticles = articles.filter(
//     (article) => article.author === authorUsername
//   )

//   const authorDetails = Object.values<Author>(metadata.authors).find(
//     (author) => author.username === authorUsername
//   )
//   if (authorDetails) {
//     authorDetails.avatar.lqip = await lqip(
//       join(
//         process.env.PWD || '',
//         '/public/images/authors',
//         authorDetails.avatar.src
//       )
//     )
//   }

//   return { props: { authorDetails, authoredArticles } }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.values<Author>(metadata?.authors).map((author) => ({
    params: { authorId: author.username },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default AuthorPage