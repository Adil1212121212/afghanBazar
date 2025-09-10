document.addEventListener('DOMContentLoaded', () => {
  console.log('Afghan Bazart script loaded');
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      console.log(`Navigating to ${link.getAttribute('href')}`);
    });
  });
});