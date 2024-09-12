/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const anwser = {
	"1": "APPLE",
	"2": "HELLO"
}

const checkAnswer = (thisGuess, word) => {
	// correct:0, position:1, not exist:2
	const res = thisGuess.split('').map((letter, index) => {
		if (word.includes(letter)) {
			return word[index] === letter ? 0 : 1
		} else {
			return 2
		}
	})
	return res
}

export default {
	async fetch(request, env, ctx) {
		// cors
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type',
		};
		// return if it's option'
		if (request.method === 'OPTIONS') {
			return new Response('Hello World!', {headers});
		}
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {status: 405});
		}
		// get request body as JSON
		try {
			const json = await request.json();
			console.log(json);
			const res = checkAnswer(json.input, anwser[json.session])
			return new Response(JSON.stringify(res), {headers});
		} catch (e) {
			console.error(e);
			return new Response('Error parsing JSON', {status: 400});
		}
		return new Response('Hello World!', {headers});
	},
};
