import { g, auth, config } from '@grafbase/sdk'

// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database

const project = g.model('Project', {
	title: g.string().length({ min: 3 }),
	image: g.string(),
	liveSiteUrl: g.url(),
	githubUrl: g.url(),
	category: g.string().search(),
	createdBy: g.relation(() => user),
})

const user = g.model('User', {
	name: g.string().length({ min: 2, max: 20 }),
	email: g.email().unique(),
	avatarUrl: g.url(),
	description: g.string().optional(),
	githubUrl: g.url().optional(),
	linkedInUrl: g.url().optional(),
	projects: g
		.relation(() => project)
		.list()
		.optional(),

	// Extend models with resolvers
	// https://grafbase.com/docs/edge-gateway/resolvers
	// gravatar: g.url().resolver('user/gravatar')
})

export default config({
	schema: g,
	// Integrate Auth
	// https://grafbase.com/docs/auth
	// auth: {
	//   providers: [authProvider],
	//   rules: (rules) => {
	//     rules.private()
	//   }
	// }
})
