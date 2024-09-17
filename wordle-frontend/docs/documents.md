# WORDLE

Most Wordle game details are included on this page.

## Task 1: Normal wordle

This is just a normal wordle in React. 

### Techniques in this task
1. bun - this is a js runtime to replace node. It's much, much faster, and it can run typescript directly. 
2. vite - for react development and bundling
2. headlessui - I like to use the transition component in it to make animate. This is very quick and light.
3. tailwindcss - for styling. For most of quick projects, tailwindcss makes it much easier.
4. ahooks - I do like some of the hooks in ahooks. In my projects for company, I have the utils and hooks written by myself for security reason. But this time I will just call them from ahooks.
5. normal stuff - like react hooks, useState, useEffect, etc. I believe most of the developers are familiar with these.
6. cloudflare pages - for deploying. This is a free static webpage hosting service just like GitHub page. And I think it's much faster than GitHub page.
7. framer motion - for animation. Actually there are a lot of choice in the market. But I like framer motion because it's very easy to use and it's very fast.

### Is there anything special in this task?

1. It's just a very simple and easy game. I think many developers can make it easily.
2. There is a requirement of configuration. I put them in the code instead of environment variables because I think actually it is meaningless changing that. I'm not sure if you want me to make it a state and allow the user to change it, but I do think it's meaningless. The game will not be more fun. Allow the user to upload their own list might also be interesting but that has increased the player's effort to start the game. In my opinion the best way is just what it is now.
3. Nothing else. Please enjoy the game :)


### Anything to improve?

In this project, I think the most important thing is to showcase that I am capable of the role so there are something that I have shifted to a lower priority.
1. UI design - While UI design is important, I've focused on demonstrating the core functionality and structure of the website. I'm confident in the site's ability to achieve its goals. With more time, I'd be happy to refine the aesthetics further.
2. Some UX improvement - There is also some small objects not finished yet. Like the keyboard, actually the different functionally keys should have different level, and also it will be good if there is an instruction for the game. But I think showing that I know these will be enough. The only thing we need after that is just the time.
3. .env file - You might have noticed I also put the .env file in the repository. It's not a common practice, but I think you might need it for testing. And it's all in the frontend code anyway.

## Task2: Server/client wordle

### Techniques in this task
This section will only be the techniques that didn't appear in the previous tasks.
1. cloudflare workers - for serverless computing. This is just a very simple task that the serverless computing is already more than enough. I don't really need an express or django or whatever server for it.
2. wrangler - this is a serverless deploying tool for cloudflare. I have also used some other tools for other platforms like serverless, aws sam, etc.

### Is there anything special in this task?


### Anything to improve?
1. I haven't added any anti-cheating mechanism. It is possible to use request to infinitely play the same word. If this is a commercial product or it is really a game for public, I think this might be necessary.

## Task3: Host cheating wordle
This is the most challenged task I think. The algorithm seems to be simple but actually there are a lot of space to improve. Also, the performance is a very important factor.

### Techniques in this task
1. WASM - For the cheating logic, I find that using native js is not enough. The size of my word list is around 2000 words, the time to iterate all letters will be so long that the user may notice it. So I put the logic in wasm which will make it much faster. And also I can showcase that I know wasm :)
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
// accept a string and a json list of string, return a list of string that no word in the list contains any letters in the string
pub fn filter_wordlist(letters: String, wordlist: JsValue) -> JsValue {
    let wordlist: Vec<String> = wordlist.into_serde().unwrap();
    let letters: Vec<char> = letters.chars().collect();
    let mut result = Vec::new();
    for word in wordlist {
        let mut valid = true;
        for letter in letters.iter() {
            if word.contains(*letter) {
                valid = false;
                break;
            }
        }
        if valid {
            result.push(word);
        }
    }
    JsValue::from_serde(&result).unwrap()
}
```

### Anything to improve?
Yes. The cheating logic can actually be improved. The logic I have now is: 
1. It will iterate all word in list and filter out all words that has no letter match.
2. If there is no word that has no letter match, it will iterate all word in list and score the word, group them according to the result it will show to the player, and sort it.
3. Choose the first group for next looping.

I guess there might be some other way that it doesn't need to iterate all words(first run will be O(M*N^2) which is insane!). But if we stick with the current logic, there is still something can be improved.
1. in the third step, there will be a lot of groups having same score. The choice will be very important. For example one group has [hello] and one group has [world,xebec], according to the logic, the first one will be chosen. But actually, if we choose the second group, it might take user 100 times to get the final result. 
2. Not only the uncommon words issue, the fun part in this game it takes user many many times to get the final result. So I think the purpose of the logic should be to make the game longer instead of only focus on one input each time. I might think about the algorithm again. It's quite interesting.


## Task4: Multi-player wordle
This task is not challenging, but it does take lots of time.
Testing it on my own during the development is a nightmare.

### How to play it?
1. This game is for 2 players.
2. Both players enter the page.
3. Both of them input the same room number (eg. 123456) and click on the Start button.
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
2. The logic of paring game - I didn't implement this feature. For now there can be only 2 players manually input the same room number to play 1 game maybe it is possible to have a paring mechanism. I think it's possible to let them pair unknown enemy. But I think make it functional is more important, and it's enough for demo already.
3. restart game feature - The right way should be after one game, there is a confirmation modal asking if they want to play again. But I don't have too much time to implement that, so after each game, the players need to fresh the page for next game.
4. websocket - actually in this task, SSE + redis might be somehow better than websocket. Websocket is too expensive for
   this task and SSE + redis is more scalable. But SSE needs more debugging and testing so eventually I chose websocket.

## Conclusion
In my opinion, this project is a demo to showcase my frontend, backend, infrastructure and algorithmic skills.
I think I have tried my best to show as much as possible.
There might be some bugs and or unfinished part, but I think it's enough for now. If you want to see a more complete version, please let me know. I can make it to the best.

