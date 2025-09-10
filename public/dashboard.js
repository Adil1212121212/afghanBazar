document.addEventListener('DOMContentLoaded', () => {
  fetch('/products')
    .then(response => response.json())
    .then(products => {
      const userId = sessionStorage.getItem('userId');
      const productList = document.getElementById('products');
      productList.innerHTML = products.filter(p => p.seller_id == userId).map(p => `<p>${p.name} - $${p.price} (Stock: ${p.stock})</p>`).join('');
    });
});