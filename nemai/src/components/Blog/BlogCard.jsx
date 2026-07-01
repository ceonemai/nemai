import { useNavigate } from "react-router-dom";
import {
  estimateReadMinutes,
  formatBlogDateShort,
  formatReadTimeLabel,
  getBlogCoverImage,
  markdownToPlainText,
  truncateText,
} from "../../utils/blogFormat";
import nemLogo from "../../assets/images/NEM_LOGO_ALT.png";

export default function BlogCard({ post, variant = "default", badgeLabel = "" }) {
  const navigate = useNavigate();
  const isFeatured = variant === "featured";

  const coverImage = getBlogCoverImage(post?.image_urls);
  const plainContent = markdownToPlainText(post?.content);
  const excerpt = truncateText(plainContent, isFeatured ? 220 : 140);
  const readMinutes = estimateReadMinutes(plainContent);
  const readTimeLabel = formatReadTimeLabel(readMinutes);
  const topLineDate = formatBlogDateShort(post?.published_at || post?.created_at);

  const handleOpenBlog = () => {
    navigate(`/blog/${post.id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenBlog();
    }
  };

  return (
    <article
      className={`blog-card ${isFeatured ? "blog-card-featured" : ""}`}
      onClick={handleOpenBlog}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open blog post ${post.title}`}
    >
      {coverImage ? (
        <img className="blog-card-image" src={coverImage} alt={post.title || "Blog cover"} loading="lazy" />
      ) : (
        <div className="blog-card-placeholder" aria-hidden="true">
          <img className="blog-card-placeholder-logo" src={nemLogo} alt="NEM AI logo" loading="lazy" />
        </div>
      )}

      <div className="blog-card-body">
        {badgeLabel ? <span className="blog-card-badge">{badgeLabel}</span> : null}
        <div className="blog-card-topline" aria-label={`Published ${topLineDate}, ${readTimeLabel}`}>
          <span>{topLineDate}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{readTimeLabel}</span>
        </div>
        <h2>{post?.title || "Untitled post"}</h2>
        <p>{excerpt || "No preview available."}</p>
      </div>
    </article>
  );
}
