// Basic interactivity
document.addEventListener('DOMContentLoaded', () => {
  console.log('Afghan Bazart script loaded');
  const langLinks = document.querySelectorAll('nav a');
  langLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      console.log(`Navigating to ${link.getAttribute('href')}`);
    });
  });
});