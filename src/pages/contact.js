import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const ContactPage = () => {
  return (
    <Layout>
      <h1>Contact Us</h1>
      <p>Aap hume contact@example.com pe mail kar sakte ho.</p>
      <Link to="/">Back to Home</Link>
    </Layout>
  )
}

export const Head = () => <Seo title="Contact" />

export default ContactPage
