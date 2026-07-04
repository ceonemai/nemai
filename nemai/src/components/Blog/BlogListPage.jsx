import { useCallback, useEffect, useState } from "react";
import { fetchBlogPosts } from "../../services/blogApi";
import BlogCard from "./BlogCard";
import { BlogEmptyState, BlogErrorState, BlogListSkeleton, BlogLoadingIndicator } from "./BlogStates";
import "./BlogListPage.css";

function getPostTimestamp(post) {
    const dateValue = post?.published_at || post?.created_at;
    const timestamp = Date.parse(dateValue || "");
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function BlogListPage() {
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState("");

    const loadPosts = useCallback(async (signal) => {
        try {
            const items = await fetchBlogPosts(signal);
            const sortedItems = [...items].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
            setPosts(sortedItems);
            setStatus(sortedItems.length === 0 ? "empty" : "success");
        } catch (error) {
            if (error?.name === "AbortError") return;
            setStatus("error");
            setErrorMessage(error?.message || "Unable to fetch blog posts.");
        }
    }, []);

    const handleRetry = async () => {
        setStatus("loading");
        setErrorMessage("");
        await loadPosts();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPosts(controller.signal);
        return () => controller.abort();
    }, [loadPosts]);

    const latestPost = posts[0] || null;
    const recentPosts = posts.slice(1);

    return (
        <main className="blog-page">
            <section className="blog-shell">
                <header className="blog-header">
                    <h1>NEM AI’s Blogs</h1>
                    <p>Insights and Updates from the Future of Health AI</p>
                </header>

                {status === "loading" && (
                    <>
                        <BlogLoadingIndicator label="Loading latest posts" />
                        <BlogListSkeleton />
                    </>
                )}

                {status === "error" && <BlogErrorState message={errorMessage} onRetry={handleRetry} />}

                {status === "empty" && <BlogEmptyState />}

                {status === "success" && (
                    <>
                        {latestPost && (
                            <div className="blog-grid-featured">
                                <BlogCard post={latestPost} variant="featured" badgeLabel="Latest" />
                            </div>
                        )}

                        {recentPosts.length > 0 && (
                            <div className="blog-grid blog-grid-recent">
                                {recentPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
