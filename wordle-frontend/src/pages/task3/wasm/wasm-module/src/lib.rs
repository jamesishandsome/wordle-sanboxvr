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