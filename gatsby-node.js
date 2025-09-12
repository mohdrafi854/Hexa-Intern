/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
const path = require("path")
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const mdxTemplate = path.resolve("./src/templates/mdx-page.js")
  const result = await graphql(`
    {
      allMdx {
        nodes {
          id
          slug
        }
      }
    }
  `)
  if (result.errors) {
    console.error(result.errors)
    throw new Error("Error fetching MDX data")
  }
  const pages = result.data.allMdx.nodes
    pages.forEach(node => {
    createPage({
      path: `/content/${node.slug}`, // e.g. /content/about
      component: mdxTemplate,
      context: {
        id: node.id,
      },
    })
  })
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}
