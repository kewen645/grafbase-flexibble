import Image from 'next/image'
import { MouseEventHandler } from 'react'

type Props = {
	title: string
	type?: 'button' | 'submit'
	leftIcon?: string
	rightIcon?: string
	handleClick?: MouseEventHandler
	isSubmitting?: boolean
	bgColor?: string
	textColor?: string
}

const Button = ({ title, type, leftIcon, rightIcon, handleClick, isSubmitting, bgColor, textColor }: Props) => {
	return (
		<button
			type={type || 'button'}
			onClick={handleClick}
			className={`flexCenter gap-3 px-4 py-3 
      ${textColor ? textColor : 'text-white'}
      ${isSubmitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'} rounded-xl text-sm font-medium max-md:w-full`}>
			{leftIcon && <Image src={leftIcon} width={14} height={14} alt='left' />}
			{title}
			{rightIcon && <Image src={rightIcon} width={14} height={14} alt='right' />}
		</button>
	)
}

export default Button
