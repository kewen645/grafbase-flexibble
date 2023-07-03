type Props = {
	title: string
	state: string
	placeholder: string
	setState: (value: string) => void
	type?: string
	isTextArea?: boolean
}

const FormField = ({ type, isTextArea, title, state, placeholder, setState }: Props) => {
	return (
		<div className='flexStart flex-col w-full gap-4'>
			<label className='w-full text-gray-100'>{title}</label>
			{isTextArea ? (
				<textarea placeholder={placeholder} value={state} className='form_field-input' onChange={(e) => setState(e.target.value)} />
			) : (
				<input
					type={type || 'text'}
					placeholder={placeholder}
					required
					value={state}
					className='form_field-input'
					onChange={(e) => setState(e.target.value)}
				/>
			)}
		</div>
	)
}

export default FormField
