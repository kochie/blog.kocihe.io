// @ts-check
import { withSentryConfig } from '@sentry/nextjs'
import PWA from 'next-pwa'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = PWA({
  dest: 'public',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
})

/**
 * @type {import('next').NextConfig}
 **/
let config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
    })
    return config
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'pbs.twimg.com', 'media-exp1.licdn.com'],
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

const plugins = [
  {
    plugin: withPWA,
    env: ['production'],
  },
  { plugin: withSentryConfig, env: ['production'] },
  { plugin: withBundleAnalyzer },
]

for (const plug of plugins) {
  if (!plug.env || plug.env.includes(process.env.NODE_ENV)) {
    // eslint-disable-next-line
    // @ts-ignore
    config = plug.plugin(config)
  }
}

export default config
