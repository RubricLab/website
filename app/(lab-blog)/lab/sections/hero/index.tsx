export interface LabHeroProps {
  preTitle?: string
  mainTitle: string
  description: string
}

export default function LabHero({
  preTitle,
  mainTitle,
  description
}: LabHeroProps) {
  return (
    <section className='relative grid min-h-fold grid-cols-12 px-px'>
      <div className='col-span-6 flex flex-col border-r border-transparent bg-surface p-em-[48] gap-em-[36]'>
        <h1 className='uppercase text-em-[72/16]'>
          {preTitle && <span className='opacity-50'>{preTitle}</span>}
          <span className='text-text'>{mainTitle}</span>
        </h1>
        <p className='text-balance uppercase text-text-secondary text-em-[18/16]'>
          {description}
        </p>
      </div>
      <span className='bg-lines col-span-1 h-full w-full' />
    </section>
  )
}
