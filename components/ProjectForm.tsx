'use client'
import { FormState, ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image'
import FormField from './FormField'
import { categoryFilters } from '@/constants'
import CustomMenu from './CustomMenu'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import Button from './Button'
import { createNewProject, fetchToken, updateUserProject } from '@/lib/actions'

type Props = {
	type: string
	session: SessionInterface
	project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
	const router = useRouter()

	const [isSubmitting, setIsSubmitting] = useState(false)

	const [form, setForm] = useState<FormState>({
		title: project?.title || '',
		description: project?.description || '',
		image: project?.image || '',
		liveSiteUrl: project?.liveSiteUrl || '',
		githubUrl: project?.githubUrl || '',
		category: project?.category || '',
	})

	const handleFormSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		const { token } = await fetchToken()

		try {
			if (type === 'create') {
				await createNewProject(form, session?.user?.id, token)
				router.push('/')
				router.refresh()
			}

			if (type === 'edit') {
				await updateUserProject(form, project?.id as string, token)
				router.push('/')
				router.refresh()
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		// ?. :指的是e.target.files && e.target.files[0] ? e.target.files[0] : undefined
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.includes('image')) {
			return alert('Please upload an image file')
		}

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const res = reader.result as string
			handleStateChange('image', res)
		}
	}

	const handleStateChange = (fieldName: string, value: string) => {
		setForm((prevForm: FormState) => ({
			...prevForm,
			[fieldName]: value,
		}))
	}

	return (
		<form onSubmit={handleFormSubmit} className='flexStart form'>
			<div className='flexStart form_image-container'>
				<label className='flexCenter form_image-label'>{!form.image && 'Choose a poster for your project'}</label>
				<input type='file' id='image' accept='image/*' required={type === 'create'} className='form_image-input' onChange={handleChangeImage} />
				{form.image && <Image src={form.image} className='object-contain z-20 sm:p-10' alt='project poster' fill />}
			</div>

			<FormField title='Title' state={form.title} placeholder='Flexibble' setState={(value) => handleStateChange('title', value)} />
			<FormField
				title='Description'
				state={form.description}
				placeholder='Showcase and discover remarkable developer projects'
				setState={(value) => handleStateChange('description', value)}
			/>
			<FormField
				type='url'
				title='Website URL'
				state={form.liveSiteUrl}
				placeholder='https://abc.com'
				setState={(value) => handleStateChange('liveSiteUrl', value)}
			/>
			<FormField
				type='url'
				title='Github URL'
				state={form.githubUrl}
				placeholder='https://github.com/xxxxx'
				setState={(value) => handleStateChange('githubUrl', value)}
			/>

			{/* customInput Category */}
			<CustomMenu title='Category' state={form.category} filters={categoryFilters} setState={(value) => handleStateChange('category', value)} />
			<div className='flexStart w-full'>
				<Button
					// this type comes from page.tsx which uses ProjectForm
					title={isSubmitting ? `${type === 'create' ? 'Creating' : 'Editing'}` : `${type === 'create' ? 'Create' : 'Edit'}`}
					type='submit'
					leftIcon={isSubmitting ? '' : '/plus.svg'}
					isSubmitting={isSubmitting}
				/>
			</div>
		</form>
	)
}

export default ProjectForm
