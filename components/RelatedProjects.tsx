import { UserProfile } from '@/common.types'
import { getUserProjects } from '@/lib/actions'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
	userId: string
	projectId: string
}

const RelatedProjects = async ({ userId, projectId }: Props) => {
	const res = (await getUserProjects(userId)) as { user?: UserProfile }

	// 展示除了这个projectId以外的，该作者的projects
	const filteredProjects = res.user?.projects?.edges.filter(({ node }) => {
		return node?.id !== projectId
	})

	if (filteredProjects?.length === 0) return null

	return (
		<section className='flex flex-col mt-32 w-full'>
			<div className='flexBetween'>
				<p className='text-base font-bold'>More by {res.user?.name}</p>
				<Link href={`/profile/${res.user?.id}`} className='text-base text-primary-purple'>
					View All
				</Link>
			</div>
			<div className='related_projects-grid'>
				{filteredProjects?.map(({ node }) => (
					<div key={node?.id} className='flexCenter related_project-card drop-shadow-card'>
						<Link href={`/project/${node?.id}`} className='flexCenter group relative w-full h-full'>
							<Image src={node?.image} width={414} height={314} alt='Project Image' className='w-full h-full rounded-2xl object-cover' />
							<div className='hidden group-hover:flex related_project-card_title'>
								<p className='w-full'>{node?.title}</p>
							</div>
						</Link>
					</div>
				))}
			</div>
		</section>
	)
}

export default RelatedProjects
