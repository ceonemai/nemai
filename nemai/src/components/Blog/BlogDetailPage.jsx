import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchBlogPostById } from "../../services/blogApi";
import {
  estimateReadMinutes,
  formatBlogDateShort,
  formatReadTimeLabel,
  getBlogCoverImage,
  markdownToPlainText,
} from "../../utils/blogFormat";
import { BlogDetailSkeleton, BlogErrorState, BlogLoadingIndicator } from "./BlogStates";
import mascotLeftImage from "../../assets/images/mascots/Mascott NEM-85.png";
import mascotRightImage from "../../assets/images/mascots/Mascott NEM-86.png";
import "./BlogDetailPage.css";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState(id ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState(id ? "" : "Invalid blog post ID.");
  const [copyStatus, setCopyStatus] = useState("idle");

  const loadPost = useCallback(
    async (signal) => {
      if (!id) return;

      try {
        const data = await fetchBlogPostById(id, signal);
        setPost(data);
        setStatus("success");
      } catch (error) {
        if (error?.name === "AbortError") return;
        setStatus("error");
        setErrorMessage(error?.message || "Unable to load this blog post.");
      }
    },
    [id]
  );

  const handleRetry = async () => {
    setStatus("loading");
    setErrorMessage("");
    await loadPost();
  };

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost(controller.signal);
    return () => controller.abort();
  }, [id, loadPost]);

  const coverImage = getBlogCoverImage(post?.image_urls);
  const plainContent = markdownToPlainText(post?.content);
  const readMinutes = estimateReadMinutes(plainContent);
  const readTimeLabel = formatReadTimeLabel(readMinutes);
  const topLineDate = formatBlogDateShort(post?.published_at || post?.created_at);
  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "NEM AI Blog";
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopyLink = async () => {
    if (!canonicalUrl) {
      setCopyStatus("error");
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = canonicalUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copied) throw new Error("Copy failed");
      }
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = setTimeout(() => setCopyStatus("idle"), 1800);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  return (
    <main className="blog-detail-page">
      <div className="blog-detail-mascots" aria-hidden="true">
        <img className="blog-detail-mascot blog-detail-mascot-left" src={mascotLeftImage} alt="" />
        <img className="blog-detail-mascot blog-detail-mascot-right" src={mascotRightImage} alt="" />
      </div>

      <article className="blog-detail-shell">
        <Link to="/blog" className="blog-back-link" aria-label="Back to blog list">
          Back to Blog
        </Link>

        {status === "loading" && (
          <>
            <BlogLoadingIndicator label="Loading blog article" />
            <BlogDetailSkeleton />
          </>
        )}

        {status === "error" && <BlogErrorState message={errorMessage} onRetry={handleRetry} />}

        {status === "success" && post && (
          <div className="blog-detail-content">
            <header className="blog-detail-header">
              <div
                className="blog-detail-topline"
                aria-label={`Published ${topLineDate}, ${readTimeLabel}`}
              >
                <span>{topLineDate}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{readTimeLabel}</span>
              </div>

              <h1>{post?.title || "Untitled post"}</h1>
            </header>

            {coverImage ? (
              <img className="blog-detail-hero" src={coverImage} alt={post.title || "Blog cover"} />
            ) : (
              <div className="blog-detail-hero blog-detail-hero-placeholder" aria-hidden="true">
                <span>NEM AI Insight</span>
              </div>
            )}

            <section className="blog-markdown">
              <ReactMarkdown>{post?.content || "No content available."}</ReactMarkdown>
            </section>

            <section className="blog-detail-share" aria-label="Share this article">
              <a
                className="blog-share-btn"
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                title="Share on Facebook"
              >
                <svg viewBox="0 0 24 24" className="blog-share-icon" aria-hidden="true">
                  <path d="M13.5 8H16V5h-2.5C11.57 5 10 6.57 10 8.5V11H8v3h2v5h3v-5h2.2l.3-3H13v-2.5c0-.28.22-.5.5-.5z" />
                </svg>
              </a>
              <a
                className="blog-share-btn"
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                title="Share on X"
              >
                <svg viewBox="0 0 24 24" className="blog-share-icon" aria-hidden="true">
                  <path d="M18.9 3H22l-6.77 7.74L23 21h-6.07l-4.75-6.23L6.72 21H3.6l7.24-8.27L3 3h6.22l4.29 5.66L18.9 3zm-1.06 16h1.69L8.28 4.9H6.47L17.84 19z" />
                </svg>
              </a>
              <a
                className="blog-share-btn"
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="blog-share-icon" aria-hidden="true">
                  <path d="M6.8 8.6H3.9V20h2.9V8.6zM5.35 7.3a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zM20.1 13.4c0-3.1-1.66-5-4.3-5-1.52 0-2.47.84-2.88 1.43V8.6h-2.8V20h2.9v-5.65c0-1.5.28-2.95 2.13-2.95 1.82 0 1.84 1.7 1.84 3.05V20H20v-6.6z" />
                </svg>
              </a>
              <button
                className="blog-share-btn blog-share-copy-btn"
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy article link"
                title="Copy article link"
              >
                <svg viewBox="0 0 24 24" className="blog-share-icon" aria-hidden="true">
                  <path d="M9.1 14.9a3 3 0 0 0 4.24 0l3.54-3.54a3 3 0 1 0-4.24-4.24L11.3 8.45l1.41 1.41 1.35-1.35a1 1 0 1 1 1.41 1.41l-3.54 3.54a1 1 0 0 1-1.41 0l-1.35-1.35-1.41 1.41 1.35 1.38z" />
                  <path d="M14.9 9.1a3 3 0 0 0-4.24 0l-3.54 3.54a3 3 0 1 0 4.24 4.24l1.34-1.34-1.41-1.41-1.34 1.34a1 1 0 1 1-1.41-1.41l3.54-3.54a1 1 0 0 1 1.41 0l1.35 1.35 1.41-1.41-1.34-1.36z" />
                </svg>
              </button>
            </section>
            <p className="blog-share-feedback" role="status" aria-live="polite">
              {copyStatus === "copied" ? "Link copied" : ""}
              {copyStatus === "error" ? "Unable to copy link" : ""}
            </p>
          </div>
        )}
      </article>
    </main>
  );
}
