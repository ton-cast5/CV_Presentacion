
// Para añadir una fotografía: coloca un archivo llamado foto.jpg junto a este HTML.
// El espacio circular mostrará la imagen automáticamente si existe.
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("profilePhoto");
  const placeholder = document.getElementById("photoPlaceholder");
  if (!img) return;
  img.addEventListener("load", () => {
    img.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
  });
  img.addEventListener("error", () => {
    img.style.display = "none";
    if (placeholder) placeholder.style.display = "block";
  });
  img.src = "foto.jpg";
});
function imprimirCV() { window.print(); }
