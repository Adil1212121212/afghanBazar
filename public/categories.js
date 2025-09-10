// Category page script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Categories script loaded');
  const categories = document.querySelectorAll('ul li');
  categories.forEach(cat => {
    cat.addEventListener('click', () => {
      alert(`Viewing ${cat.textContent} category`);
    });
  });
});