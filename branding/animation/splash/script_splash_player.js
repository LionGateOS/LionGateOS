document.addEventListener("DOMContentLoaded", () => {
  const v = document.getElementById("splash");
  v.onended = () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
      // placeholder: OS shell load event
    }, 500);
  };
});
