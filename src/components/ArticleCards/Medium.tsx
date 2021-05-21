import React, { ReactElement } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TagSet, Tag, CardDetails, Card } from '..'

import style from './ArticleCards.module.css'

const MediumCard = ({
  title,
  image,
  blurb,
  readTime,
  tags,
  articleDir,
}: CardDetails): ReactElement => {
  return (
    <div className="md:col-span-3 col-span-6 w-full h-full">
      <Card>
        <div className="flex flex-col">
          <div className="bg-black rounded-t-lg relative">
            <Image
              src={image.url}
              alt={image.alt}
              layout={'responsive'}
              height={300}
              width={600}
              className="bg-black rounded-t-lg"
            />
            <div className="absolute p-4 bottom-0">
              <TagSet>
                {tags.map((tag) => (
                  <Tag key={tag} name={tag} link={`/tags/${tag}`} />
                ))}
              </TagSet>
            </div>
          </div>
          <div className="p-4">
            <Link href={'/articles/[articleId]'} as={`/articles/${articleDir}`}>
              <h2 className={style.heading}>{title}</h2>
            </Link>
            <p className="mb-8">{blurb}</p>
            <div className="text-right absolute bottom-0 right-0 p-4">
              <sub>{readTime}</sub>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MediumCard
