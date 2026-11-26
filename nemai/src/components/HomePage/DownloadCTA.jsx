import { appDownloadUrl } from "./content";

export default function DownloadCTA({ placement }) {
  const badge = <img src={`${import.meta.env.BASE_URL}app%20screenshot/en-us.svg`} alt="App Store download" />;

  if (!appDownloadUrl) {
    return (
      <div className="download-action">
        <button className="download-badge" type="button" disabled aria-describedby={`download-note-${placement}`}>
          {badge}
        </button>
        <span className="download-note" id={`download-note-${placement}`}>App Store release and link pending</span>
      </div>
    );
  }

  return (
    <div className="download-action">
      <a
        className="download-badge"
        href={appDownloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => window.dispatchEvent(new CustomEvent("nemai:download", { detail: { placement } }))}
      >
        {badge}
      </a>
    </div>
  );
}
