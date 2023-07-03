import { UserProfile } from '@/common.types'
import ProfilePage from '@/components/ProfilePage'
import { getUserProjects } from '@/lib/actions'

const UserProfile = async ({ params: { id } }: { params: { id: string } }) => {
	const res = (await getUserProjects(id, 100)) as { user: UserProfile }

	if (!res?.user) {
		return <p className='no-result-text'>Failed to fetch user profile</p>
	}

	return <ProfilePage user={res?.user} />
}

export default UserProfile
