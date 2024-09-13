import answerList from './answers.js';

const checkAnswer = (thisGuess, word) => {
	// correct:0, position:1, not exist:2
	const res = thisGuess.split('').map((letter, index) => {
		if (word.includes(letter)) {
			return word[index] === letter ? 0 : 1;
		} else {
			return 2;
		}
	});
	return res;
};

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
			return new Response('Hello World!', { headers });
		}
		if (request.method === 'GET') {
			// if it is /init-game
			if (request.url.endsWith('/init-game')) {
				const length = answerList.length;
				const session = Math.floor(Math.random() * length);

				return new Response(JSON.stringify({ session }), { headers });
			}
			const { searchParams } = new URL(request.url);
			const session = searchParams.get('session');
			if (!session) return new Response('No session', { status: 400 });
			return new Response(JSON.stringify(answerList[session]), { headers });
		}
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 });
		}
		// get request body as JSON
		try {
			const json = await request.json();
			console.log(json);
			const res = checkAnswer(json.input, answerList[json.session]);
			return new Response(JSON.stringify(res), { headers });
		} catch (e) {
			console.error(e);
			return new Response('Error parsing JSON', { status: 400 });
		}
		return new Response('Hello World!', { headers });
	},
};
