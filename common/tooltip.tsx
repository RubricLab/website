'use client'
import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'

export type SimpleTooltipProps = {
  content: React.ReactNode
  delayDuration?: Tooltip.TooltipProps['delayDuration']
  disabled?: boolean
  className?: string
  side?: Tooltip.TooltipContentProps['side']
  sideOffset?: Tooltip.TooltipContentProps['sideOffset']
} & Omit<Tooltip.TooltipProps, 'className'>

export function SimpleTooltip({
  delayDuration = 200,
  ...props
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <CustomTooltip {...props} />
    </TooltipProvider>
  )
}

export function CustomTooltip({
  children,
  content,
  className,
  ...props
}: SimpleTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={clsx(
            'z-[999] border border-border bg-surface-secondary px-2 py-1 text-sm text-text max-w-em-[200]',
            className
          )}
          {...props}>
          {content}
          <Tooltip.Arrow asChild>
            <Arrow />
          </Tooltip.Arrow>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

function Arrow() {
  return (
    <svg
      className='-mt-px'
      fill='none'
      height='10'
      viewBox='0 0 12 10'
      width='12'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        className='fill-surface-secondary stroke-border'
        d='M6 7.5L0.5 0.5H11.5L6 7.5Z'
      />
      <path
        className='fill-surface-secondary'
        d='M1 0H11L10.5 1H1.5L1 0Z'
      />
    </svg>
  )
}

export function TooltipProvider({
  children,
  delayDuration = 200
}: {
  children?: React.ReactNode
  delayDuration?: number
}) {
  return (
    <Tooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={500}>
      {children}
    </Tooltip.Provider>
  )
}
