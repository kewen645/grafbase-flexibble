import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '@/constants'
import AuthProviders from './AuthProviders'

const Navbar = () => {
	const session = {}
	return (
		<nav className='flexBetween navbar'>
			<div className='flex-1 flexStart gap-10'>
				<Link href='/'>
					<Image src='/logo.svg' alt='Flexibble' width={115} height={43} />
				</Link>
				<ul className='hidden text-small gap-7 xl:flex'>
					{NavLinks.map((link) => (
						<Link href={link.href} key={link.key}>
							{link.text}
						</Link>
					))}
				</ul>
			</div>
			<div className='flexCenter gap-4'>
				{session ? (
					<>
						UserPhoto
						<Link href='/create-project'>Share work</Link>
					</>
				) : (
					<AuthProviders />
				)}
			</div>
		</nav>
	)
}

export default Navbar
