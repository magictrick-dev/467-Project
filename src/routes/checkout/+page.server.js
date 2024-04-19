import { orders } from '$lib/order.js';

export function load() {
	return {
		summaries: orders.map((order) => ({
			slug: order.slug,
			name: order.name,
      items: order.items,
      quantities: order.quantities
		}))
	};
}