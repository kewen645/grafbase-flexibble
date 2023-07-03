import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '@/constants'
import AuthProviders from './AuthProviders'
import { getCurrentUser } from '@/lib/session'
import ProfileMenu from './ProfileMenu'

const Navbar = async () => {
	const session = await getCurrentUser()

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
						{/* ProfileMenu是client side render， 然而NavBar是SSR */}
						<ProfileMenu session={session} />
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
