import {cva, type VariantProps} from 'class-variance-authority'
import {forwardRef} from 'react'

export const $tag = cva(
  'flex border uppercase transition-colors duration-500 ease-out focus-visible:outline-white focus-visible:outline-2 focus-visible:outline',
  {
    variants: {
      intent: {
        default: 'border-border text-text-secondary',
        secondary:
          'border-text-tertiary bg-surface-contrast/5 text-text-tertiary opacity-60',
        active: 'border-text text-text',
        contrast: 'border-text-contrast text-text-contrast'
      },
      disabled: {
        true: 'opacity-30'
      },
      size: {
        sm: 'text-em-[14/16] py-em-[2] px-em-[8]',
        md: 'text-em-[16/16] py-em-[3] px-em-[12]',
        lg: 'text-em-[18/16] py-em-[4] px-em-[16]'
      }
    }
  }
)

type TagProps<C extends keyof JSX.IntrinsicElements> = VariantProps<
  typeof $tag
> &
  JSX.IntrinsicElements[C]

export const Tag = forwardRef<HTMLSpanElement, TagProps<'span'>>(
  (
    {
      children,
      className,
      intent = 'default',
      disabled = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={$tag({
          intent,
          disabled,
          size,
          className
        })}
        {...props}>
        {children}
      </span>
    )
  }
)

Tag.displayName = 'Tag'
