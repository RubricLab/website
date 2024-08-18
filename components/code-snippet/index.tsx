import type {BundledLanguage} from 'shiki'

import {fragmentOn} from 'basehub'

import cn from '@/lib/utils/cn'
import {FileIcon} from '@radix-ui/react-icons'
import s from './code-snippet.module.css'
import {CopyButton} from './copy-button'
import {Highlighter} from './highlight'
import {languagesIcons} from './language'

export const codeSnippetFragment = fragmentOn('CodeSnippetComponent', {
  _id: true,
  code: {
    code: true,
    language: true
  },
  _title: true
})

export type CodeSnippetFragment = fragmentOn.infer<typeof codeSnippetFragment>

export function CodeSnippet({code, _title = 'Untitled'}: CodeSnippetFragment) {
  return (
    <div
      className={cn(
        s['code-snippet'],
        'flex w-full flex-col border border-border my-em-[24] text-em-[14/16]'
      )}>
      <header className={s.header}>
        <div className='flex items-center text-text-secondary'>
          <span className='mr-2 size-4'>
            {languagesIcons[code.language as BundledLanguage] ?? <FileIcon />}
          </span>
          <span>{_title}</span>
        </div>
        <CopyButton text={code.code} />
      </header>
      <CodeSnippetContent {...code} />
    </div>
  )
}

export function CodeSnippetContent({
  code,
  language
}: CodeSnippetFragment['code']) {
  return (
    <div className={s.content}>
      <Highlighter lang={language as BundledLanguage}>{code}</Highlighter>
    </div>
  )
}
