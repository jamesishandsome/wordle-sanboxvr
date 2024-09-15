import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "James Hu's Wordle",
    description: "James Hu's Wordle",
    base: '/docs/',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Docs', link: '/documents' },
        ],

        sidebar: [
            {
                text: 'Docs',
                items: [
                    {
                        text: 'Documents',
                        link: '/documents',
                    },
                    {
                        text: 'Task 1',
                        link: '/documents#task-1-normal-wordle',
                    },
                    {
                        text: 'Task 2',
                        link: '/documents#task2-server-client-wordle',
                    },
                    {
                        text: 'Task 3',
                        link: '/documents#task3-host-cheating-wordle',
                    },
                    {
                        text: 'Task 4',
                        link: '/documents#task4-multi-player-wordle',
                    },
                    {
                        text: 'Conclusion',
                        link: '/documents#conclusion',
                    },
                ],
            },
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/jamesishandsome/wordle-sanboxvr',
            },
        ],
    },
})
