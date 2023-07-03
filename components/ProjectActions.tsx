'use client'
import { deleteUserProject, fetchToken } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ProjectActions = ({ projectId }: { projectId: string }) => {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDeleteProject = async () => {
		if (confirm('Are you sure to delete?')) {
			setIsDeleting(true)
			const token = await fetchToken()

			try {
				await deleteUserProject(projectId, token)
				router.push('/')
			} catch (error) {
				throw error
			} finally {
				setIsDeleting(false)
			}
		}
	}

	return (
		<>
			<Link href={`/edit-project/${projectId}`} className='flexCenter edit-action_btn'>
				<Image src='/pencile.svg' width={15} height={15} alt='edit' />
			</Link>
			<button type='button' className={`flexCenter delete-action_btn ${isDeleting ? 'bg-gray' : 'bg-primary-purple'}`} onClick={handleDeleteProject}>
				<Image src='/trash.svg' width={15} height={15} alt='delete' />
			</button>
		</>
	)
}

export default ProjectActions
