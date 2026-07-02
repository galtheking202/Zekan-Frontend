document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img.shot').forEach((img) => {
    const fallback = () => {
      if (!img.src.endsWith('placeholder.svg')) img.src = '/shots/placeholder.svg';
    };
    img.addEventListener('error', fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });
});
