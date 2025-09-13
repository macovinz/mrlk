import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";

import Home from "@/pages/Home";
import AboutPage from "@/pages/About";
import PodcastPage from "@/pages/Podcast";
import SinglePodcast from "@/pages/SinglePodcast";
import BlogPage from "@/pages/BlogPage";
import NewsArticle from "@/pages/SingleBlog";
import MissyBirthdayLanding from "@/pages/MissyBirthday";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/missy" element={<MissyBirthdayLanding />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/podcast/:slug" element={<SinglePodcast />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<NewsArticle />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
