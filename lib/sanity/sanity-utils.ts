import {createClient, groq} from 'next-sanity'
import {CaseStudy, Home, Newsletter, Post, Project} from '../lib/types/sanity'

// Sanity client
const sanity = createClient({
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
	useCdn: true
})

// Get copy for home page
export async function getHomePageCopy(): Promise<Home> {
	// Groq fetch query
	return sanity.fetch(
		// Returns an array, so default to first value
		groq`*[_type == "home"][0]{
        _id,
        _createdAt,
        hero,
        desc,
        "team": team[] | order(name asc){
          "_key": _key,
          "name": name,
          "title": title,
          "slug": slug.current,
          "image": image.asset->url
        }
    }`
	)
}

// Get projects
export async function getProjects(): Promise<Project[]> {
	// Groq fetch query
	return sanity.fetch(
		groq`*[_type == "project"]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        url,
        content
    }`
	)
}

// Get list of all blog posts
export async function getPosts(): Promise<Post[]> {
	// Groq fetch query
	return sanity.fetch(
		groq`*[_type == "post" && publishedAt < now()] | order(publishedAt desc){
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        "mainImage": mainImage.asset->url,
        publishedAt
    }`
	)
}

// Get singular post from slug
export async function getPost(slug: string): Promise<Post> {
	// Groq fetch query
	return sanity.fetch(
		// Returns an array, so default to first value
		groq`*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        "mainImage": mainImage.asset->url,
        body,
        publishedAt,
        "authorName": author->firstName,
        "authorTwitter": author->twitter,
    }`,
		{slug}
	)
}

// Get list of all case studies
export async function getCaseStudies(): Promise<CaseStudy[]> {
	return sanity.fetch(
		groq`*[_type == "caseStudy" && publishedAt < now() ] | order(publishedAt desc){
            _id,
            _createdAt,
            title,
            summary,
            "slug": slug.current,
            "imageUrl": image.asset->url,
            publishedAt
        }`
	)
}

// Get singular case study by slug
export async function getCaseStudy(slug: string): Promise<CaseStudy> {
	return sanity.fetch(
		// Returns an array, so default to first value
		groq`*[_type == "caseStudy" && slug.current == $slug][0]{
            _id,
            _createdAt,
            title,
            "slug": slug.current,
            "imageUrl": image.asset->url,
            body,
            publishedAt,
        }`,
		{slug}
	)
}

// Get list of all newsletter posts
export async function getNewsletterPosts(): Promise<Newsletter[]> {
	// Groq fetch query
	return sanity.fetch(
		groq`*[_type == "newsletter" && publishedAt < now()] | order(publishedAt){
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        publishedAt
    }`
	)
}

// Get singular newsletter post from slug
export async function getNewsletterPost(slug: string): Promise<Newsletter> {
	// Groq fetch query
	return sanity.fetch(
		// Returns an array, so default to first value
		groq`*[_type == "newsletter" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        body,
        publishedAt,
        "authorName": author->firstName,
        "authorTwitter": author->twitter,
    }`,
		{slug}
	)
}
