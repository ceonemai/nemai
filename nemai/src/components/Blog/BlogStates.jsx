export function BlogLoadingIndicator({ label = "Loading posts" }) {
  return (
    <div className="blog-loading-indicator" role="status" aria-live="polite">
      <span className="blog-loading-dot" />
      <span>{label}</span>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="blog-grid" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <article className="blog-card blog-card-skeleton" key={index}>
          <div className="blog-card-image skeleton-block" />
          <div className="blog-card-body">
            <div className="skeleton-line skeleton-line-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-short" />
            <div className="blog-card-meta">
              <div className="skeleton-line skeleton-chip" />
              <div className="skeleton-line skeleton-chip" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="blog-detail-content" aria-hidden="true">
      <div className="blog-detail-hero skeleton-block" />
      <div className="skeleton-line skeleton-line-title" />
      <div className="blog-detail-meta">
        <div className="skeleton-line skeleton-chip" />
        <div className="skeleton-line skeleton-chip" />
      </div>
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-short" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-short" />
    </div>
  );
}

export function BlogErrorState({ message, onRetry }) {
  return (
    <div className="blog-state-card" role="alert">
      <h3>Unable to load blog content</h3>
      <p>{message || "Something went wrong. Please try again."}</p>
      <button type="button" className="blog-state-btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function BlogEmptyState() {
  return (
    <div className="blog-state-card">
      <h3>No blog posts yet</h3>
      <p>We are preparing fresh health intelligence stories. Please check back soon.</p>
    </div>
  );
}
