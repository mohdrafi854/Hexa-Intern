import * as React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"  // <-- yahan change
import Layout from "../components/layout"

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date
        tags
      }
      body
    }
  }
`

const MdxPage = ({ data }) => {
  const { frontmatter, body } = data.mdx

  return (
    <Layout>
      <article style={{ padding: "20px" }}>
        <h1>{frontmatter.title}</h1>
        <p><b>Date:</b> {frontmatter.date}</p>
        {frontmatter.tags && (
          <p><b>Tags:</b> {frontmatter.tags.join(", ")}</p>
        )}
        <hr />
        <MDXRenderer>{body}</MDXRenderer>
      </article>
    </Layout>
  )
}

export default MdxPage
