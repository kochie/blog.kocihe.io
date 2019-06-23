export interface CardDetails {
    title: string,
    image: {
        src: string,
        lqip: string
    },
    blurb: string,
    readTime: number,
    tags: string[]
}

export { default as Small } from "./Small/Small"
export { default as Medium } from "./Medium/Medium"
export { default as Large } from "./Large/Large"