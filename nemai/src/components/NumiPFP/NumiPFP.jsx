import { useRef, useEffect, useState } from 'react';
import './NumiPFP.css';

const TEMPLATES = ['/numi/Numi_1.png', '/numi/Numi_2.png', '/numi/Numi_3.png'];

export default function NumiPFP() {
  const canvasRef = useRef(null);
  const sizeSliderRef = useRef(null);

  // Image objects
  const userImg = useRef(new Image());
  const overlayImg = useRef(new Image());

  // Mutable state (refs, not state — avoid re-render on every drag frame)
  const hasUserImageRef = useRef(false);
  const hasOverlayRef = useRef(false);
  const currentEditModeRef = useRef('photo');

  const bgX = useRef(0), bgY = useRef(0), bgScale = useRef(1);
  const mascotX = useRef(0), mascotY = useRef(0), mascotScale = useRef(1);
  const isDragging = useRef(false);
  const dragStartX = useRef(0), dragStartY = useRef(0);

  // React state (drives UI re-renders only)
  const [editMode, setEditMode] = useState('photo');
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [sliderLabel, setSliderLabel] = useState('Resize Photo (Click & Drag to move)');
  const [canDownload, setCanDownload] = useState(false);

  // ── Render canvas ────────────────────────────────────────────────────────
  function renderCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (hasUserImageRef.current) {
      ctx.drawImage(
        userImg.current,
        bgX.current, bgY.current,
        userImg.current.width * bgScale.current,
        userImg.current.height * bgScale.current
      );
    }
    if (hasOverlayRef.current) {
      ctx.drawImage(
        overlayImg.current,
        mascotX.current, mascotY.current,
        overlayImg.current.width * mascotScale.current,
        overlayImg.current.height * mascotScale.current
      );
    }
  }

  // ── Load a mascot template ───────────────────────────────────────────────
  function loadTemplate(index) {
    setActiveTemplate(index);
    overlayImg.current = new Image();
    overlayImg.current.onload = () => {
      hasOverlayRef.current = true;
      const canvas = canvasRef.current;
      mascotScale.current = Math.min(
        (canvas.width * 0.8) / overlayImg.current.width,
        (canvas.height * 0.8) / overlayImg.current.height
      );
      mascotX.current = (canvas.width - overlayImg.current.width * mascotScale.current) / 2;
      mascotY.current = (canvas.height - overlayImg.current.height * mascotScale.current) / 2;
      if (currentEditModeRef.current === 'mascot' && sizeSliderRef.current) {
        sizeSliderRef.current.value = mascotScale.current;
      }
      setCanDownload(true);
      renderCanvas();
    };
    overlayImg.current.src = TEMPLATES[index];
  }

  // ── Canvas drag + touch events ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;

    function getCanvasPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    }

    function startDrag(e) {
      e.preventDefault();
      const pos = getCanvasPos(e);
      isDragging.current = true;
      dragStartX.current = pos.x;
      dragStartY.current = pos.y;
    }

    function doDrag(e) {
      if (!isDragging.current) return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      const dx = pos.x - dragStartX.current;
      const dy = pos.y - dragStartY.current;
      if (currentEditModeRef.current === 'photo' && hasUserImageRef.current) {
        bgX.current += dx;
        bgY.current += dy;
      } else if (currentEditModeRef.current === 'mascot' && hasOverlayRef.current) {
        mascotX.current += dx;
        mascotY.current += dy;
      }
      dragStartX.current = pos.x;
      dragStartY.current = pos.y;
      renderCanvas();
    }

    function endDrag() { isDragging.current = false; }

    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', endDrag);
    canvas.addEventListener('touchstart', startDrag, { passive: false });
    canvas.addEventListener('touchmove', doDrag, { passive: false });
    window.addEventListener('touchend', endDrag);

    // Auto-load first template
    loadTemplate(0);

    return () => {
      canvas.removeEventListener('mousedown', startDrag);
      canvas.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', endDrag);
      canvas.removeEventListener('touchstart', startDrag);
      canvas.removeEventListener('touchmove', doDrag);
      window.removeEventListener('touchend', endDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── File upload ──────────────────────────────────────────────────────────
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      userImg.current = new Image();
      userImg.current.onload = () => {
        hasUserImageRef.current = true;
        const canvas = canvasRef.current;
        bgScale.current = Math.max(
          canvas.width / userImg.current.width,
          canvas.height / userImg.current.height
        );
        bgX.current = (canvas.width / 2) - (userImg.current.width / 2) * bgScale.current;
        bgY.current = (canvas.height / 2) - (userImg.current.height / 2) * bgScale.current;
        if (currentEditModeRef.current === 'photo' && sizeSliderRef.current) {
          sizeSliderRef.current.min = bgScale.current * 0.2;
          sizeSliderRef.current.max = bgScale.current * 3;
          sizeSliderRef.current.value = bgScale.current;
        }
        setCanDownload(true);
        renderCanvas();
      };
      userImg.current.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── Edit mode toggle ─────────────────────────────────────────────────────
  function handleModeChange(mode) {
    setEditMode(mode);
    currentEditModeRef.current = mode;
    if (mode === 'photo') {
      setSliderLabel('Resize Photo (Click & Drag to move)');
      if (sizeSliderRef.current) {
        sizeSliderRef.current.min = 0.1;
        sizeSliderRef.current.max = 3;
        sizeSliderRef.current.value = bgScale.current;
      }
    } else {
      setSliderLabel('Resize Mascot (Click & Drag to move)');
      if (sizeSliderRef.current) {
        sizeSliderRef.current.min = 0.05;
        sizeSliderRef.current.max = 0.3;
        sizeSliderRef.current.value = mascotScale.current;
      }
    }
  }

  // ── Slider ───────────────────────────────────────────────────────────────
  function handleSlider(e) {
    const val = parseFloat(e.target.value);
    if (currentEditModeRef.current === 'photo' && hasUserImageRef.current) {
      const centerX = bgX.current + (userImg.current.width * bgScale.current) / 2;
      const centerY = bgY.current + (userImg.current.height * bgScale.current) / 2;
      bgScale.current = val;
      bgX.current = centerX - (userImg.current.width * bgScale.current) / 2;
      bgY.current = centerY - (userImg.current.height * bgScale.current) / 2;
    } else if (currentEditModeRef.current === 'mascot' && hasOverlayRef.current) {
      const centerX = mascotX.current + (overlayImg.current.width * mascotScale.current) / 2;
      const centerY = mascotY.current + (overlayImg.current.height * mascotScale.current) / 2;
      mascotScale.current = val;
      mascotX.current = centerX - (overlayImg.current.width * mascotScale.current) / 2;
      mascotY.current = centerY - (overlayImg.current.height * mascotScale.current) / 2;
    }
    renderCanvas();
  }

  // ── Download ─────────────────────────────────────────────────────────────
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (hasUserImageRef.current || hasOverlayRef.current) {
      const link = document.createElement('a');
      link.download = 'NEM-AI-Profile-Picture.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }

  return (
    <div className="numi-pfp-page">
      <div className="customizer-card">
        <h1>NEM AI Numi PFP</h1>
        <p className="subtitle">Show your support by adding Numi to your profile picture!</p>

        {/* Upload */}
        <div className="upload-container">
          <button className="btn-upload" onClick={() => document.getElementById('numiImageUpload').click()}>
            Upload Photo
          </button>
          <input
            type="file"
            id="numiImageUpload"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Mascot Templates */}
        <div className="mascot-templates">
          {TEMPLATES.map((src, i) => (
            <button
              key={i}
              className={`template-btn${activeTemplate === i ? ' active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
              onClick={() => loadTemplate(i)}
            />
          ))}
        </div>

        {/* Layer Toggle */}
        <div className="layer-toggle">
          <label
            className={editMode === 'photo' ? 'active' : ''}
            onClick={() => handleModeChange('photo')}
          >
            <input type="radio" name="editMode" value="photo" readOnly checked={editMode === 'photo'} />
            Resize Photo
          </label>
          <label
            className={editMode === 'mascot' ? 'active' : ''}
            onClick={() => handleModeChange('mascot')}
          >
            <input type="radio" name="editMode" value="mascot" readOnly checked={editMode === 'mascot'} />
            Resize Mascot
          </label>
        </div>

        {/* Slider */}
        <div className="controls-container">
          <label htmlFor="sizeSlider">{sliderLabel}</label>
          <input
            type="range"
            id="sizeSlider"
            ref={sizeSliderRef}
            min="0.1"
            max="0.3"
            step="0.01"
            defaultValue="0.15"
            onChange={handleSlider}
          />
        </div>

        {/* Canvas Preview */}
        <div className="preview-container">
          <canvas ref={canvasRef} width="600" height="600" />
        </div>

        {/* Download */}
        <button className="btn-download" onClick={handleDownload} disabled={!canDownload}>
          Download Your Numi PFP
        </button>
      </div>
    </div>
  );
}
