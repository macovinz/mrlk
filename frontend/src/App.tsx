import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import AboutPage from "@/pages/About"
import EventsPage from "@/pages/Podcast"
import EventDetail from "@/pages/SinglePodcast"
import NewsPage from "@/pages/BlogPage"
import NewsArticle from "@/pages/SingleBlog"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/podcast" element={<EventsPage />} />
          <Route path="/podcast/:slug" element={<EventDetail />} />
          <Route path="/blog" element={<NewsPage />} />
          <Route path="/blog/:slug" element={<NewsArticle />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
