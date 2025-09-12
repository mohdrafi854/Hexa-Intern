import * as React from "react"
import { Link } from "gatsby"


import Layout from "../components/layout"
import Seo from "../components/seo"
const AboutPage = () => {
  return (
    <Layout>
      <h1>About Us</h1>
      <p>Yeh About page hai. Yahan aap apne project/company ke baare me likh sakte ho.</p>
      <Link to="/">Back to Home</Link>
    </Layout>
  )
}

export const Head = () => <Seo title="About" />

export default AboutPage