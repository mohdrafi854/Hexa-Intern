import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { Link } from "gatsby"

const PostPage = () => {
  return (
    <Layout>
      <Seo title="My Post" />
      <h1>My First Post</h1>
      <p>
        Yeh post page hai jisme image optimization ka example dikhaya gaya hai.
      </p>
      <StaticImage
        src="https://www.fastweb.com/uploads/article_photo/photo/2036641/10-ways-to-be-a-better-student.jpeg"
        alt="Post Image"
        placeholder="blurred"
        layout="constrained"
        width={600}
      />
      <p>
        Image automatically optimized using Gatsby's <b>StaticImage</b>.
      </p>
       <Link to="/">Back to Home</Link>
    </Layout>
  )
}

export default PostPage
