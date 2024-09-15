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

