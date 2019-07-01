declare module 'authors.json' {
  export interface SocialMedia {
    name: string
    link: string
    icon: import("@fortawesome/fontawesome-svg-core").IconProp
    color: string
  }

  export interface Author {
    username: string
    fullName: string
    email: string
    socialMedia: SocialMedia[]
    avatar: {
      lqip: string
      src: string
    }
  }

  type Authors = Author[]
  export default Authors
}
