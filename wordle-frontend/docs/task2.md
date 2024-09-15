## Task2: Server/client wordle

### Techniques in this task
This section will only be the techniques that didn't appear in the previous tasks.
1. cloudflare workers - for serverless computing. This is just a very simple task that the serverless computing is already more than enough. I don't really need an express or django or whatever server for it.
2. wrangler - this is a serverless deploying tool for cloudflare. I have also used some other tools for other platforms like serverless, aws sam, etc.

### Is there anything special in this task?


### Anything to improve?
1. I haven't added any anti-cheating mechanism. It is possible to use request to infinitely play the same word. If this is a commercial product or it is really a game for public, I think this might be necessary.
