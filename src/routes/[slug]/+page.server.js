import { error } from '@sveltejs/kit';
import { products } from '../data.js';

export function load({ params }) {
	const post = products.find((post) => post.slug === params.slug);

	if (!post) throw error(404);

	return {
		post
	};
}