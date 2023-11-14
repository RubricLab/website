import {addSubscriber} from '../actions'
import Button from './Button'

export default async function NewsletterForm() {
	return (
		<form
			className='flex w-full flex-col justify-end gap-5'
			action={addSubscriber}>
			<input
				type='text'
				name='name'
				placeholder='First name'
				required
			/>
			<input
				type='text'
				name='company'
				placeholder='Company'
				required
			/>
			<input
				type='text'
				name='email'
				placeholder='Email'
				required
			/>
			<Button
				variant='dark'
				type='submit'
				body='Subsrcibe'
			/>
		</form>
	)
}
