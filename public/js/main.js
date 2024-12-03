let currentPage = 1;
const itemsPerPage = 10;

// Fetch and display items
async function fetchItems(page = 1) {
    try {
        const response = await fetch(`/api/items?page=${page}&limit=${itemsPerPage}`);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Search items
async function searchItems() {
    const name = document.getElementById('searchInput').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`/api/items/search?${params}`);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display items in the list
function displayItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description || 'No description'}</p>
            <p>Created: ${new Date(item.date_created).toLocaleDateString()}</p>
            <button onclick="editItem(${item.id})">Edit</button>
            <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Modal handling
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('itemModal').style.display = 'block';
}

async function editItem(id) {
    const response = await fetch(`/api/items/${id}`);
    const item = await response.json();
    
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = id;
    document.getElementById('name').value = item.name;
    document.getElementById('description').value = item.description || '';
    document.getElementById('itemModal').style.display = 'block';
}

// Form submission
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('itemId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/items/${id}` : '/api/items';
    
    try {
        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });
        
        document.getElementById('itemModal').style.display = 'none';
        fetchItems(currentPage);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete item
async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await fetch(`/api/items/${id}`, { method: 'DELETE' });
            fetchItems(currentPage);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Pagination
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchItems(currentPage);
        document.getElementById('currentPage').textContent = currentPage;
    }
}

function nextPage() {
    currentPage++;
    fetchItems(currentPage);
    document.getElementById('currentPage').textContent = currentPage;
}

// Initial load
fetchItems(); 