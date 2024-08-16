const BackgroundGrid = () => {
	return (
		<div className='px-sides text-border pointer-events-none fixed inset-0 z-0 flex'>
			<div
				className='left-sides absolute h-full w-px'
				style={{
					backgroundSize: '1px 1.5rem',
					background: `repeating-linear-gradient(
								to bottom,
								transparent 0px 12px,
								currentColor 12px 24px
							)`
				}}
			/>
			<div className='grid h-full w-full grid-cols-12 '>
				{[...Array(12)].map((_, index) => (
					<div
						key={index}
						className='justify-self-end'
						style={{
							width: '1px',
							backgroundSize: '1px 1.5rem',
							background: `repeating-linear-gradient(
								to bottom,
								transparent 0px 12px,
								currentColor 12px 24px
							)`
						}}
					/>
				))}
			</div>
		</div>
	)
}

export default BackgroundGrid
