import {draftMode} from 'next/headers'

import {Pump} from 'basehub/react-pump'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {PageView} from '@/components/page-view'
import {BASEHUB_REVALIDATE_TIME} from '@/lib/basehub/constants'
import {metadataOverridesFragment} from '@/lib/basehub/fragments/metadata'
import {basehub} from 'basehub'
import type {Metadata} from 'next'
import LabHero from './sections/hero'
import LabShowcase from './sections/showcase'

export const dynamic = 'force-static'

export const revalidate = BASEHUB_REVALIDATE_TIME

export const generateMetadata = async (): Promise<Metadata | undefined> => {
  const data = await basehub({
    cache: 'no-store',
    draft: draftMode().isEnabled
  }).query({
    site: {
      lab: {
        metadata: metadataOverridesFragment
      }
    }
  })

  return {
    title: data.site.lab.metadata.title ?? undefined,
    description: data.site.lab.metadata.description ?? undefined
  }
}

export default async function BlogPage() {
  return (
    <>
      <BackgroundGrid
        data={{
          sm: {columnCount: 4},
          md: {columnCount: 4},
          lg: {columnCount: 12, highlightColumns: [7, 9, 11]},
          xl: {columnCount: 12, highlightColumns: [7, 9, 11]},
          '2xl': {columnCount: 12, highlightColumns: [7, 9, 11]}
        }}
      />
      <Pump
        draft={draftMode().isEnabled}
        next={{revalidate: BASEHUB_REVALIDATE_TIME}}
        queries={[
          {
            site: {
              lab: {
                _analyticsKey: true,
                metadata: metadataOverridesFragment,
                hero: {
                  preTitle: true,
                  mainTitle: true,
                  description: true
                }
              }
            }
          }
        ]}>
        {async ([
          {
            site: {lab}
          }
        ]) => {
          'use server'

          return (
            <>
              <PageView _analyticsKey={lab._analyticsKey} />

              <LabHero {...lab.hero} />

              <LabShowcase />
            </>
          )
        }}
      </Pump>
    </>
  )
}
