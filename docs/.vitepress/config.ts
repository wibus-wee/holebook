/*
 * @FilePath: /holebook/docs/.vitepress/config.ts
 * @author: Wibus
 * @Date: 2022-11-23 23:40:19
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-24 09:29:24
 * Coding With IU
 */
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: "zh-CN",
  title: "wibus 的 HoleBook",
  description: "全是挖大坑的烂笔记",
  titleTemplate: "wibus 的 HoleBook",

  themeConfig: {
    logo: '/hole.svg',


    sidebar: {
      '/': [
        {
          text: 'CSS',
          items: [
            {
              text: '如何撰写高性能 CSS',
              link: '/css/high-performance-css'
            },
            {
              text: '关于CSS的选择器',
              link: '/css/selector'
            },
          ],
          collapsible: true,
          collapsed: true,
        },
        {
          text: 'JavaScript',
          items: [
            {
              text: 'Proxy ES6',
              link: '/js/proxy'
            },
            {
              text: '细说 Fetch API',
              link: '/js/fetch'
            }
          ],
          collapsible: true,
          collapsed: true,
        },
        {
          text: 'React',
          items: [
            {
              text: '如何合理使用 React Hooks',
              link: '/react/how-to-use-hooks'
            }
          ],
          collapsed: true,
          collapsible: true
        },
        {
          text: 'TypeScript',
          items: [
            {
              text: '从入门到放弃的类型系统',
              link: '/typescript/type-system'
            }
          ],
          collapsed: true,
          collapsible: true
        },
      ]
    }




  }
})