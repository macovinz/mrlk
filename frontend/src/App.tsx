import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import PodcastPage from "@/pages/Podcast";
import SinglePodcast from "@/pages/SinglePodcast";
import BlogPage from "@/pages/BlogPage";
import NewsArticle from "@/pages/SingleBlog";
//import Affirmations from "./pages/Affirmations";


export default function App() {
  return (
    <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/podcast" element={<PodcastPage />} />
            <Route path="/podcast/:slug" element={<SinglePodcast />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<NewsArticle />} />
          </Routes>
        </Layout>
    </BrowserRouter>
  );
}
