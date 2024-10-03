import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type SVGProps, useRef } from 'react'
export interface SearchEmptyStateIllustrationProps extends SVGProps<SVGSVGElement> {
	className?: string
}
export default function SearchEmptyStateIllustration({
	className,
	...props
}: SearchEmptyStateIllustrationProps) {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const tl = useRef(
		gsap.timeline({
			repeat: -1,
			delay: 0.2,
			defaults: {
				duration: 1.2,
				ease: 'sine.inOut'
			}
		})
	)
	useGSAP(
		() => {
			if (!svgRef.current) return

			const lines = gsap.utils.toArray(svgRef.current.querySelectorAll('#empty-state-fill path'))

			gsap.set(lines, {
				drawSVG: '0% 0%'
				// opacity: 0
			})
			gsap.set(svgRef.current, {
				opacity: 1
			})

			tl.current
				.to(lines, {
					drawSVG: '0% 100%',
					//   opacity: 1,
					stagger: 0.05
				})
				.to(lines, {
					drawSVG: '100% 100%',
					//   opacity: 0,
					stagger: 0.05
				})
		},
		{ revertOnUpdate: true, scope: svgRef }
	)

	return (
		<svg
			ref={svgRef}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1356 1278"
			fill="none"
			className={className}
			style={{ opacity: 0 }}
			{...props}
		>
			<title>Search Icon</title>
			<g
				opacity={1}
				stroke="currentColor"
				strokeWidth={4}
				strokeDasharray={30}
				strokeDashoffset={30}
				strokeMiterlimit={10}
			>
				<path d="M316.1 305V179l529-145 500 255v789l-686 189-499-253 1-629 155-80Z" />
				<path d="M659.1 1267V479l686-190" />
				<path strokeLinejoin="round" d="m659.1 486-356-188" />
				<path d="m161.1 385 157 79 3-157 140-56-113-56-32-16M439.1 532l-75 34" />
				<path d="m460.1 595-45-133-96-51M559.1 152l12 51-73-13-99 30M234.1 422v94M77.8 12l132.5 24.6 64.4 84.9-65.2 135-133-24.4L12 147.6 77.8 12Z" />
				<path d="m76.5 232.1 65.1-134.8 133.1 24.2" />
				<path strokeLinejoin="round" d="M141.101 98.5 77.801 12" />
				<path d="m974.1 705-52 13v-71l52-12v70ZM1074.1 610.6l-100 24v-71l100-23v70ZM1126.1 734.699l-52 13v-137l52-12v136ZM1022.1 900.399l-52 13v-71l52-12v70ZM1074.1 817.399l-52 13v-71l52-12v70ZM1023.1 1005.3l-52 13v-71l52-12v70Z" />
			</g>
			<g id="empty-state-fill" stroke="currentColor" strokeWidth={8} strokeMiterlimit={10}>
				<path d="M316.1 305V179l529-145 500 255v789l-686 189-499-253 1-629 155-80Z" />
				<path d="M659.1 1267V479l686-190" />
				<path strokeLinejoin="round" d="m659.1 486-356-188" />
				<path d="m161.1 385 157 79 3-157 140-56-113-56-32-16M439.1 532l-75 34" />
				<path d="m460.1 595-45-133-96-51M559.1 152l12 51-73-13-99 30M234.1 422v94M77.8 12l132.5 24.6 64.4 84.9-65.2 135-133-24.4L12 147.6 77.8 12Z" />
				<path d="m76.5 232.1 65.1-134.8 133.1 24.2" />
				<path strokeLinejoin="round" d="M141.101 98.5 77.801 12" />
				<path d="m974.1 705-52 13v-71l52-12v70ZM1074.1 610.6l-100 24v-71l100-23v70ZM1126.1 734.699l-52 13v-137l52-12v136ZM1022.1 900.399l-52 13v-71l52-12v70ZM1074.1 817.399l-52 13v-71l52-12v70ZM1023.1 1005.3l-52 13v-71l52-12v70Z" />
			</g>
		</svg>
	)
}
