import { ProjectInterface } from '@/common.types'
import Categories from '@/components/Categories'
import LoadMore from '@/components/LoadMore'
import ProjectCard from '@/components/ProjectCard'
import { fetchAllProjects } from '@/lib/actions'

type ProjectSearch = {
	projectSearch: {
		edges: { node: ProjectInterface }[]
		pageInfo: {
			hasPreviousPage: boolean
			hasNextPage: boolean
			startCursor: string
			endCursor: string
		}
	}
}

type Props = {
	searchParams: {
		category?: string
		endcursor?: string
	}
}

// force-dynamic
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

// 组件接收的参数: {params} 和 {searchParams}不一样的
// {params}是路径传参， {searchParams}是？传参
const Home = async ({ searchParams: { category, endcursor } }: Props) => {
	const data = (await fetchAllProjects(category, endcursor)) as ProjectSearch
	const projectsToDisplay = data.projectSearch?.edges || []
	if (projectsToDisplay.length === 0) {
		return (
			<section className='flexStart flex-col paddings'>
				<Categories />
				<p className='no-result-text text-center'>No projects found, go create some first.</p>
			</section>
		)
	}

	const pagination = data?.projectSearch?.pageInfo

	return (
		<section className='flex flex-col flexStart paddings mb-16'>
			<Categories />
			<section className='projects-grid'>
				{projectsToDisplay.map(({ node }) => (
					<ProjectCard
						key={node?.id}
						id={node?.id}
						image={node?.image}
						title={node?.title}
						name={node?.createdBy?.name}
						avatarUrl={node?.createdBy?.avatarUrl}
						userId={node?.createdBy?.id}
					/>
				))}
			</section>
			{/* Pagination in GraphQL */}
			<LoadMore
				startCursor={pagination?.startCursor}
				endCursor={pagination?.endCursor}
				hasPreviousPage={pagination?.hasPreviousPage}
				hasNextPage={pagination?.hasNextPage}
			/>
		</section>
	)
}

export default Home
