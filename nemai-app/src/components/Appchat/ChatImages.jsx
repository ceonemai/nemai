import { useEffect, useRef, useState } from "react";

export function LocalChatImage({ file, className }) {
  const imageRef = useRef(null);

  useEffect(() => {
    const preview = URL.createObjectURL(file);
    imageRef.current.src = preview;
    return () => URL.revokeObjectURL(preview);
  }, [file]);

  return <img ref={imageRef} alt={file.name} className={className} />;
}

export function DraftChatImage({ file, uploadError, onRemove, onRetry, disabled }) {
  return (
    <div>
      <div className="chat-draft-image">
        <LocalChatImage file={file} />
        <button type="button" aria-label={`Remove ${file.name}`} onClick={onRemove} disabled={disabled}>×</button>
      </div>
      {uploadError && (
        <button
          type="button"
          className="chat-draft-retry"
          aria-label={`Retry upload for ${file.name}`}
          onClick={onRetry}
          disabled={disabled}
        >
          {uploadError} · Retry
        </button>
      )}
    </div>
  );
}

export function ChatImage({ id, apiUrl, getAuthHeaders }) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const key = `${id}/${attempt}`;
    let objectUrl;

    async function load() {
      try {
        const response = await fetch(`${apiUrl}/files/${encodeURIComponent(id)}`, {
          headers: await getAuthHeaders(false),
          cache: "no-store",
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Image unavailable");
        const image = await response.blob();
        if (!controller.signal.aborted) {
          objectUrl = URL.createObjectURL(image);
          setResult({ key, url: objectUrl });
        }
      } catch {
        if (!controller.signal.aborted) setResult({ key, error: true });
      }
    }

    load();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, attempt, apiUrl, getAuthHeaders]);

  if (result?.key !== `${id}/${attempt}`) return <span role="status">Loading image…</span>;
  if (result.error) {
    return <button type="button" onClick={() => setAttempt((value) => value + 1)}>Retry image</button>;
  }
  return <img className="chat-message-image" src={result.url} alt="Attachment" />;
}
