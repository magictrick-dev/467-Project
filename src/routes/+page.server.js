import { products } from '$lib/data.js';

export function load() {
	return {
		summaries: products.map((product) => ({
			slug: product.slug,
			title: product.title,
      description: product.content
		}))
	};
}