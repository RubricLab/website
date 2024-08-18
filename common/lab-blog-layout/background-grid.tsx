'use client'

const backgroundGradient = `repeating-linear-gradient(
								to bottom,
								transparent 0px 0.75em,
								rgb(var(--color-border)) 0.75em 1.5em
							)`

export type BackgroundGridProps = {
  highlightColumns?: number[]
}

const BackgroundGrid = ({highlightColumns}: BackgroundGridProps) => {
  return (
    <div className='pointer-events-none fixed inset-0 z-0 flex px-sides text-border'>
      <div
        className='absolute left-sides h-full w-px'
        style={{
          backgroundSize: '1px 1.5em',
          background: backgroundGradient
        }}
      />
      <div className='grid h-full w-full grid-cols-12 '>
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className={`grid
			${highlightColumns?.includes(index) ? 'bg-surface-contrast/5' : ''}`}>
            <span
              className='w-px justify-self-end'
              style={{
                backgroundSize: '1px 1.5em',
                background: backgroundGradient
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BackgroundGrid
