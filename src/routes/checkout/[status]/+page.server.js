import { error } from '@sveltejs/kit';
import { orders } from '$lib/order.js';

export function load({ params }) {
  console.log(params);
	const post = orders.find((inst) => {
    return (inst.slug === params.status)
  });

	if (post == null) throw error(404);

	return {
		post
	};
}