import React, {
  ReactElement,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import Highlight, { Language, defaultProps } from 'prism-react-renderer'
import themeDark from 'prism-react-renderer/themes/nightOwl'
import themeLight from 'prism-react-renderer/themes/nightOwlLight'

import styles from './codeblock.module.css'
import { THEME, useTheme } from '@/components/Theme/context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/pro-duotone-svg-icons'

interface CodeBlockProps {
  className?: string
}

const RE = /{([\d,-]+)}/

const calculateLinesToHighlight = (
  meta: string
): ((index: number) => boolean) => {
  if (!RE.test(meta)) {
    return (): boolean => false
  } else {
    const lineNumbers = RE.exec(meta)?.[1]
      .split(',')
      .map((v) => v.split('-').map((v) => parseInt(v, 10)))
    return (index: number): boolean => {
      const lineNumber = index + 1
      const inRange = lineNumbers?.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      )
      return !!inRange
    }
  }
}

const CodeBlock = ({
  children,
  className,
}: PropsWithChildren<CodeBlockProps>): ReactElement => {
  const language = className
    ?.replace(/language-/, '')
    ?.replace(RE, '') as Language
  const shouldHighlightLine = calculateLinesToHighlight(className || '')
  const code = children?.toString().trimEnd() || ''
  const [theme] = useTheme()

  const [isDark, setIsDark] = useState(false)

  const codeTheme = isDark ? themeDark : themeLight
  const highlightClass = isDark
    ? styles['highlight-code-line-dark']
    : styles['highlight-code-line-light']

  useEffect(() => {
    switch (theme) {
      case THEME.dark: {
        setIsDark(true)
        break
      }
      case THEME.light: {
        setIsDark(false)
        break
      }
      case THEME.system: {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDark(true)
        }
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          setIsDark(false)
        }
        break
      }
    }
  }, [theme])

  return (
    <div className="my-5 relative">
      <FontAwesomeIcon
        icon={faClipboard}
        size="xl"
        className="absolute top-3 right-3 cursor-pointer p-2 bg-gray-500 hover:bg-gray-600 duration-200 rounded-lg active:bg-slate-50"
        onClick={() => {
          navigator.clipboard.writeText(code)
        }}
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
      />
      <Highlight
        {...defaultProps}
        code={code}
        language={language}
        theme={codeTheme}
      >
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }): ReactElement => (
          <pre
            className={`${className} ${styles.code} `}
            style={{
              ...style,
            }}
          >
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })
              lineProps.className = `${lineProps.className}`
              if (shouldHighlightLine(i)) {
                lineProps.className = `${lineProps.className} ${highlightClass}`
              }

              return (
                <div key={i} {...lineProps}>
                  <span className="select-none opacity-50 pr-4 w-11 inline-block text-right">
                    {i + 1}
                  </span>
                  <span className="">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export default CodeBlock
export { calculateLinesToHighlight }
