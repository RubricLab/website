import {SVGProps} from 'react'
const LabLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 1000 300'
    fill='none'
    {...props}>
    <path
      fill='currentColor'
      d='M0 0h100v250h200v50H0V0Z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M550 0H450v50h-50v50h-50v200h100v-50h100v50h100V100h-50V50h-50V0Zm0 200V100H450v100h100ZM700 0v300h300V100h-99.999V0H700Zm200.001 250V150H800v100h100.001Zm-50-150H800V50h50.001v50Z'
      clipRule='evenodd'
    />
  </svg>
)
export default LabLogo

