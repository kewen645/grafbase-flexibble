import { GraphQLClient } from 'graphql-request'
import {
	getUserQuery,
	createUserMutation,
	createProjectMutation,
	projectsQuery,
	getProjectByIdQuery,
	getUserProjectsQuery,
	deleteProjectMutation,
	updateProjectMutation,
} from '@/graphql'
import { ProjectForm } from '@/common.types'

// grafbase dev for development environment
const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_ENDPOINT || '' : 'http://127.0.0.1:4000/graphql'
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : '1234'
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
	try {
		return await client.request(query, variables)
	} catch (error) {
		throw error
	}
}

export const getUser = (email: string) => {
	client.setHeader('x-api-key', apiKey)
	return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
	client.setHeader('x-api-key', apiKey)
	const variables = {
		input: {
			name,
			email,
			avatarUrl,
		},
	}

	return makeGraphQLRequest(createUserMutation, variables)
}

export const uploadImage = async (imagePath: string) => {
	try {
		const response = await fetch(`${serverUrl}/api/upload`, {
			method: 'POST',
			body: JSON.stringify({ path: imagePath }),
		})
		return response.json()
	} catch (error) {
		throw error
	}
}

export const fetchToken = async () => {
	try {
		const response = await fetch(`${serverUrl}/api/auth/token`)
		return response.json()
	} catch (error) {
		throw error
	}
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
	const imageUrl = await uploadImage(form.image)
	if (imageUrl.url) {
		client.setHeader('Authorization', `Bearer ${token}`)
		client.setHeader('x-api-key', apiKey)

		const variables = {
			input: {
				...form,
				image: imageUrl.url,
				createdBy: {
					link: creatorId,
				},
			},
		}
		return makeGraphQLRequest(createProjectMutation, variables)
	}
}

export const fetchAllProjects = (category?: string, endcursor?: string) => {
	client.setHeader('x-api-key', apiKey)
	return makeGraphQLRequest(projectsQuery, { category, endcursor })
}

export const getProjectDetails = (id: string) => {
	client.setHeader('x-api-key', apiKey)
	return makeGraphQLRequest(getProjectByIdQuery, { id })
}

export const getUserProjects = (id: string, last?: number) => {
	client.setHeader('x-api-key', apiKey)
	return makeGraphQLRequest(getUserProjectsQuery, { id, last })
}

export const deleteUserProject = (id: string, token: string) => {
	client.setHeader('x-api-key', apiKey)
	client.setHeader('Authorization', `Bearer ${token}`)
	return makeGraphQLRequest(deleteProjectMutation, { id })
}

export const updateUserProject = async (form: ProjectForm, projectId: string, token: string) => {
	// 检查用户是否更新了上传图片，如果没更新，那么就是一个cloudinary的url
	// 更新了，就是一个base64DataUrl
	function isBase64DataURL(value: string) {
		const base64Regex = /^data:image\/[a-z]+;base64,/
		return base64Regex.test(value)
	}

	let updatedForm = { ...form }
	const isUploadingNewImage = isBase64DataURL(form.image)

	if (isUploadingNewImage) {
		// 重新上传新图片
		const imageUrl = await uploadImage(form.image)
		// 上传完成后
		if (imageUrl.url) {
			updatedForm = { ...updatedForm, image: imageUrl.url }
		}
	}

	client.setHeader('x-api-key', apiKey)
	client.setHeader('Authorization', `Bearer ${token}`)

	const variables = {
		id: projectId,
		input: updatedForm,
	}
	return makeGraphQLRequest(updateProjectMutation, variables)
}
