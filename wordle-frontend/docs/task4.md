## Task4: Multi-player wordle
This task is not challenging, but it does take lots of time.
Testing it on my own during the development is a nightmare.

### How to play it?
1. This game is for 2 players.
2. Both players enter the page.
3. Both of them clicking on the Start button.
4. Their answer will be same word and they need to input one by one.
5. They can also refer to the answer the other player input.
6. Whoever get the correct answer will win.
7. If both of them used up all the tries, the game will end.
8. If you want to play this game again, both player please refresh the page and start from the beginning.(I don't have time to finish this restart feature :( )

### Techniques in this task
1. Socket.io - for real-time communication. I have used it in both frontend and backend. Just to make websocket easier. Actually writing a normal websocket server is not that hard. But this way is more elegant.
2. Linux - Because it is a websocket server, so serverless services is not enough. I have used my own server on Oracle Cloud(because it is free). The connection might not be good for all the areas. Please kindly let me know if you can't connect. I will move it to somewhere else then.
3. CircleCI - for CI/CD. I need my own CI/CD to deploy it to my server. I have used GitHub Actions before, but my GitHub account is running out of quota. So for this time I used CircleCI.

### Is there anything special in this task?
Thinking about how to make it more interesting is a big challenge. I have imagined some ideas but after discussing with my gf, we think the most traditional way is the best.
Here are some of my ideas based on my current one:
1. The player can choose to do 1 step or 2 steps. For example, if the player choose to do 2 steps, that player will guess two words before the other player. This might be interested when the user wants to wait the other user to give more information or when a user thinks the information is enough to the answer and want to end the game before the other player notice. (Didn't do this because I think it might make the user run out the attempts fast but adding max try or make it infinite is boring)
2. There are multiple words and just like Tetris, when you successfully guess a word, it will increase other player's difficulty(maybe deduct their max attempts, or give them a random word instead of letting them input). But I also haven't found a good and balanced way to achieve that. If I have one month to do this, this might be my final decision.

### Anything to improve?
I don't have too much time to work on this task so actually there are a lot of things I haven't done.
1. UI - The modals are quite ugly and I think if I have one more day, I will fix it. But unfortunately, I still have my full time job :(
2. The logic of paring game. I didn't implement this feature. For now there can be only 2 players playing 1 game because I hardcoded the room id. It is not difficult to allow user to input the room id and let them pair on their own. But I think make it functional is more important, and it's enough for demo already.
