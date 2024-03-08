const ordersList = document.getElementById('orders-list');
const totalElement = document.getElementById('total');
const apiUrl = 'https://crudcrud.com/api/d64a1a9c18f8412b81c5705bcd00d800/orders';

let orders = [];
let total = 0;

async function addToBill() {
  const dish = document.getElementById('dish').value;
  const price = parseInt(document.getElementById('price').value);
  const table = parseInt(document.getElementById('table').value);

  orders.push({ dish, price, table });
  total += price;

  await saveOrder({ dish, price, table });
  fetchOrders();
}

async function fetchOrders() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    orders = data;
    displayOrders();
    updateTotal();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

function displayOrders() {
  ordersList.innerHTML = '';
  orders.forEach((order, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.dish}</td>
      <td>${order.price}</td>
      <td>${order.table}</td>
      <td><button onclick="deleteOrder(${index})">Delete</button></td>
    `;
    ordersList.appendChild(row);
  });
}

async function saveOrder(order) {
  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

function updateTotal() {
  totalElement.textContent = `Total: $${total}`;
}

async function deleteOrder(index) {
  const orderId = orders[index]._id;
  total -= orders[index].price;
  await deleteOrderFromApi(orderId);
  orders.splice(index, 1);

  displayOrders();
  updateTotal();
}

async function deleteOrderFromApi(orderId) {
  try {
    await fetch(`${apiUrl}/${orderId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
  }
}

// Fetch orders on page load
fetchOrders();
