
let token = localStorage.getItem("token") || null;
let user = JSON.parse(localStorage.getItem("user") || "null");
// ==========================================
// ADMIN NAME & AVATAR
// ==========================================

function loadAdminInfo() {
    if (!user) return;

    const adminName = document.getElementById("adminNameDisplay");
    const adminEmail = document.getElementById("adminEmailDisplay");
    const adminAvatar = document.getElementById("adminAvatar");

    if (adminName) {
        adminName.textContent = user.name || "Administrator";
    }
    if (adminEmail) {
        adminEmail.textContent = user.email || "";
    }
    if (adminAvatar) {
        adminAvatar.textContent = (user.name || "A").charAt(0).toUpperCase();
    }
}

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {
    try {
        await Promise.all([
            loadRoomStats(),
            loadBookingStats(),
            loadFoodOrderStats(),
            loadRecentOrders()
        ]);
    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

// ==========================================
// ROOMS - STATS
// ==========================================

async function loadRoomStats() {
    try {
        const data = await apiRequest("/rooms");
        const rooms = Array.isArray(data) ? data : data.rooms || [];

        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room.status === "AVAILABLE").length;
        const occupiedRooms = rooms.filter(room => room.status === "OCCUPIED").length;
        const reservedRooms = rooms.filter(room => room.status === "RESERVED").length;
        const maintenanceRooms = rooms.filter(room => room.status === "MAINTENANCE").length;

        const statTotalRooms = document.getElementById("statTotalRooms");
        const statAvailableRooms = document.getElementById("statAvailableRooms");
        
        if (statTotalRooms) statTotalRooms.textContent = totalRooms;
        if (statAvailableRooms) statAvailableRooms.textContent = availableRooms;

        renderRoomStatus({
            available: availableRooms,
            occupied: occupiedRooms,
            reserved: reservedRooms,
            maintenance: maintenanceRooms
        });

    } catch (error) {
        console.error("Failed to load rooms:", error);
    }
}

function renderRoomStatus(stats) {
    const container = document.getElementById("roomStatusContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="flex items-center text-gray-600">
                <span class="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                Available
            </span>
            <span class="font-bold text-gray-800">${stats.available}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="flex items-center text-gray-600">
                <span class="w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
                Occupied
            </span>
            <span class="font-bold text-gray-800">${stats.occupied}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="flex items-center text-gray-600">
                <span class="w-3 h-3 rounded-full bg-orange-500 mr-3"></span>
                Reserved
            </span>
            <span class="font-bold text-gray-800">${stats.reserved}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="flex items-center text-gray-600">
                <span class="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
                Maintenance
            </span>
            <span class="font-bold text-gray-800">${stats.maintenance}</span>
        </div>
    `;
}

// ==========================================
// ROOMS - CRUD with Image Support (FIXED)
// ==========================================

async function loadRooms() {
    try {
        const data = await apiRequest("/rooms");
        const rooms = Array.isArray(data) ? data : data.rooms || [];
        const tbody = document.getElementById("roomsTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (rooms.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-10 text-center text-gray-500">No rooms found.</td>
                </tr>
            `;
            return;
        }

        rooms.forEach(room => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50";
            row.innerHTML = `
                <td class="py-3 px-4">
                    ${room.image ? `<img src="${escapeHTML(room.image)}" class="w-12 h-12 rounded object-cover" alt="Room ${room.roomNumber}">` : `<div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">🛏️</div>`}
                </td>
                <td class="py-3 px-4 font-medium text-gray-900">${escapeHTML(room.roomNumber)}</td>
                <td class="py-3 px-4 text-gray-600">${escapeHTML(room.type)}</td>
                <td class="py-3 px-4 text-gray-600">${formatMoney(room.price)} ETB</td>
                <td class="py-3 px-4">${statusBadge(room.status)}</td>
                <td class="py-3 px-4 text-right">
                    <button onclick='editRoom(${JSON.stringify(room)})' class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button onclick="openDeleteModal('room','${room.id}')" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load rooms:", error);
        showToast(error.message, "error");
    }
}

function openRoomModal() {
    document.getElementById("roomForm").reset();
    document.getElementById("roomId").value = "";
    document.getElementById("roomModalTitle").textContent = "Add Room";
    document.getElementById("roomSubmitBtn").textContent = "Add Room";
    document.getElementById("roomStatus").value = "AVAILABLE";
    document.getElementById("roomImagePreviewContainer").classList.add("hidden");
    document.getElementById("roomModal").classList.remove("hidden");
}

function closeRoomModal() {
    document.getElementById("roomModal").classList.add("hidden");
}

function editRoom(room) {
    document.getElementById("roomId").value = room.id;
    document.getElementById("roomNumber").value = room.roomNumber || "";
    document.getElementById("roomType").value = room.type || "STANDARD";
    document.getElementById("roomPrice").value = room.price || "";
    document.getElementById("roomStatus").value = room.status || "AVAILABLE";
    document.getElementById("roomModalTitle").textContent = "Edit Room";
    document.getElementById("roomSubmitBtn").textContent = "Update Room";
    
    const previewContainer = document.getElementById("roomImagePreviewContainer");
    const previewImg = document.getElementById("roomImagePreview");
    if (room.image) {
        previewImg.src = room.image;
        previewContainer.classList.remove("hidden");
    } else {
        previewContainer.classList.add("hidden");
    }
    
    document.getElementById("roomModal").classList.remove("hidden");
}

async function submitRoomForm(e) {
    e.preventDefault();
    
    const id = document.getElementById("roomId").value;
    const roomNumber = document.getElementById("roomNumber").value.trim();
    const type = document.getElementById("roomType").value;
    const price = document.getElementById("roomPrice").value;
    const status = document.getElementById("roomStatus").value;
    const imageFile = document.getElementById("roomImage").files[0];

    if (!roomNumber || !type || !price) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    try {
        let imageUrl = null;
        
        // Upload image if selected
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);
            
            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            
            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error('Upload error response:', errorText);
                throw new Error(`Upload failed: ${uploadRes.status}`);
            }
            
            const uploadData = await uploadRes.json();
            console.log('Upload response:', uploadData);
            
            imageUrl = uploadData.url || uploadData.imageUrl;
            
            if (!imageUrl) {
                throw new Error('No image URL returned from upload');
            }
        }

        const roomData = { 
            roomNumber, 
            type, 
            price: Number(price), 
            status
        };
        
        // Only add image if we have one
        if (imageUrl) {
            roomData.image = imageUrl;
        }

        console.log('Sending room data:', roomData);

        if (id) {
            await apiRequest(`/rooms/${id}`, { 
                method: "PUT", 
                body: JSON.stringify(roomData) 
            });
            showToast("Room updated successfully.", "success");
        } else {
            await apiRequest("/rooms", { 
                method: "POST", 
                body: JSON.stringify(roomData) 
            });
            showToast("Room added successfully.", "success");
        }
        
        closeRoomModal();
        await loadRooms();
        await loadRoomStats();
    } catch (error) {
        console.error('Submit room error:', error);
        showToast(error.message || "Failed to save room.", "error");
    }
}

// ==========================================
// BOOKINGS
// ==========================================

async function loadBookingStats() {
    try {
        const data = await apiRequest("/bookings");
        const bookings = Array.isArray(data) ? data : data.bookings || [];
        const today = new Date();
        const todayBookings = bookings.filter(booking => {
            const created = new Date(booking.createdAt);
            return created.toDateString() === today.toDateString();
        });
        const statTodayBookings = document.getElementById("statTodayBookings");
        if (statTodayBookings) statTodayBookings.textContent = todayBookings.length;
    } catch (error) {
        console.error("Failed to load bookings:", error);
    }
}

async function loadAllBookings() {
    try {
        const data = await apiRequest("/bookings");
        const bookings = Array.isArray(data) ? data : data.bookings || [];
        const tbody = document.getElementById("reservationsTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-gray-500">No reservations found.</td>
                </tr>
            `;
            return;
        }

        bookings.forEach(booking => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50";
            row.innerHTML = `
                <td class="py-3 px-4 font-medium text-gray-900">${escapeHTML(booking.user?.name || "Unknown")}</td>
                <td class="py-3 px-4 text-gray-600">${escapeHTML(booking.user?.email || "-")}</td>
                <td class="py-3 px-4 text-gray-600">Room ${booking.room?.roomNumber || "-"}</td>
                <td class="py-3 px-4 text-gray-600">${formatDate(booking.checkIn)}</td>
                <td class="py-3 px-4 text-gray-600">${formatDate(booking.checkOut)}</td>
                <td class="py-3 px-4 text-gray-600">${formatMoney(booking.totalPrice)} ETB</td>
                <td class="py-3 px-4">${statusBadge(booking.status)}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load reservations:", error);
    }
}

// ==========================================
// FOOD ORDERS
// ==========================================

async function loadFoodOrderStats() {
    try {
        const data = await apiRequest("/food-orders");
        const orders = Array.isArray(data) ? data : data.orders || [];
        const pendingOrders = orders.filter(order => order.status === "PENDING");
        const statPendingOrders = document.getElementById("statPendingOrders");
        if (statPendingOrders) statPendingOrders.textContent = pendingOrders.length;
    } catch (error) {
        console.error("Failed to load food orders:", error);
    }
}

async function loadRecentOrders() {
    try {
        const data = await apiRequest("/food-orders");
        const orders = Array.isArray(data) ? data : data.orders || [];
        const tbody = document.getElementById("ordersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-gray-500">No food orders found.</td>
                </tr>
            `;
            return;
        }

        orders.slice(0, 10).forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="py-3 px-2 font-medium text-gray-900">#${order.id.slice(0, 8)}</td>
                <td class="py-3 px-2 text-gray-600">${escapeHTML(order.user?.name || "Unknown")}</td>
                <td class="py-3 px-2 text-gray-600">${escapeHTML(order.food?.name || "Unknown")}</td>
                <td class="py-3 px-2 text-gray-600">${order.quantity}</td>
                <td class="py-3 px-2 text-gray-600">${formatMoney(order.totalPrice)} ETB</td>
                <td class="py-3 px-2">${statusBadge(order.status)}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load recent orders:", error);
    }
}

async function loadAllFoodOrders() {
    try {
        const data = await apiRequest("/food-orders");
        const orders = Array.isArray(data) ? data : data.orders || [];
        const tbody = document.getElementById("foodOrdersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-gray-500">No food orders found.</td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50";
            row.innerHTML = `
                <td class="py-3 px-4 font-medium text-gray-900">#${order.id.slice(0, 8)}</td>
                <td class="py-3 px-4 text-gray-600">${escapeHTML(order.user?.name || "Unknown")}</td>
                <td class="py-3 px-4 text-gray-600">${escapeHTML(order.food?.name || "Unknown")}</td>
                <td class="py-3 px-4 text-gray-600">${order.quantity}</td>
                <td class="py-3 px-4 text-gray-600">${formatMoney(order.totalPrice)} ETB</td>
                <td class="py-3 px-4 text-gray-600">${formatDate(order.createdAt)}</td>
                <td class="py-3 px-4">${statusBadge(order.status)}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load food orders:", error);
    }
}

// ==========================================
// FOOD MENU with Image Support (FIXED)
// ==========================================

async function loadFoods() {
    try {
        const data = await apiRequest("/menu");
        const foods = Array.isArray(data) ? data : data.foods || data.menu || [];
        const tbody = document.getElementById("foodTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (foods.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-10 text-center text-gray-500">No food items found.</td>
                </tr>
            `;
            return;
        }

        foods.forEach(food => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50";
            row.innerHTML = `
                <td class="py-3 px-4">
                    ${food.image ? `<img src="${escapeHTML(food.image)}" class="w-12 h-12 rounded object-cover" alt="${escapeHTML(food.name)}">` : `<div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">🍽️</div>`}
                </td>
                <td class="py-3 px-4 font-medium text-gray-900">${escapeHTML(food.name)}</td>
                <td class="py-3 px-4 text-gray-600">${escapeHTML(food.category)}</td>
                <td class="py-3 px-4 text-gray-600">${formatMoney(food.price)} ETB</td>
                <td class="py-3 px-4">
                    <button onclick="toggleFoodAvailability('${food.id}', ${food.available})" 
                        class="px-2 py-1 rounded text-xs font-medium ${food.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${food.available ? "Available" : "Unavailable"}
                    </button>
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick='editFood(${JSON.stringify(food)})' class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button onclick="openDeleteModal('food','${food.id}')" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load foods:", error);
        showToast(error.message, "error");
    }
}

function openFoodModal() {
    document.getElementById("foodForm").reset();
    document.getElementById("foodId").value = "";
    document.getElementById("foodAvailable").checked = true;
    document.getElementById("foodModalTitle").textContent = "Add Food";
    document.getElementById("foodSubmitBtn").textContent = "Add Food";
    document.getElementById("foodImagePreviewContainer").classList.add("hidden");
    document.getElementById("foodModal").classList.remove("hidden");
}

function closeFoodModal() {
    document.getElementById("foodModal").classList.add("hidden");
}

function editFood(food) {
    document.getElementById("foodId").value = food.id;
    document.getElementById("foodName").value = food.name || "";
    document.getElementById("foodDesc").value = food.description || "";
    document.getElementById("foodPrice").value = food.price || "";
    document.getElementById("foodCategory").value = food.category || "BREAKFAST";
    document.getElementById("foodAvailable").checked = food.available !== false;
    document.getElementById("foodModalTitle").textContent = "Edit Food";
    document.getElementById("foodSubmitBtn").textContent = "Update Food";
    
    const previewContainer = document.getElementById("foodImagePreviewContainer");
    const previewImg = document.getElementById("foodImagePreview");
    if (food.image) {
        previewImg.src = food.image;
        previewContainer.classList.remove("hidden");
    } else {
        previewContainer.classList.add("hidden");
    }
    
    document.getElementById("foodModal").classList.remove("hidden");
}

async function submitFoodForm(e) {
    e.preventDefault();
    
    const id = document.getElementById("foodId").value;
    const name = document.getElementById("foodName").value.trim();
    const description = document.getElementById("foodDesc").value.trim();
    const price = document.getElementById("foodPrice").value;
    const category = document.getElementById("foodCategory").value;
    const imageFile = document.getElementById("foodImage").files[0];
    const available = document.getElementById("foodAvailable").checked;

    if (!name || !price || !category) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    try {
        let imageUrl = null;
        
        // Upload image if selected
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);
            
            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            
            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error('Upload error response:', errorText);
                throw new Error(`Upload failed: ${uploadRes.status}`);
            }
            
            const uploadData = await uploadRes.json();
            console.log('Upload response:', uploadData);
            
            imageUrl = uploadData.url || uploadData.imageUrl;
            
            if (!imageUrl) {
                throw new Error('No image URL returned from upload');
            }
        }

        const foodData = {
            name,
            description: description || null,
            price: Number(price),
            category,
            available
        };
        
        // Only add image if we have one
        if (imageUrl) {
            foodData.image = imageUrl;
        }

        console.log('Sending food data:', foodData);

        if (id) {
            await apiRequest(`/menu/${id}`, { 
                method: "PATCH", 
                body: JSON.stringify(foodData) 
            });
            showToast("Food updated successfully.", "success");
        } else {
            await apiRequest("/menu", { 
                method: "POST", 
                body: JSON.stringify(foodData) 
            });
            showToast("Food added successfully.", "success");
        }
        closeFoodModal();
        await loadFoods();
    } catch (error) {
        console.error('Submit food error:', error);
        showToast(error.message || "Failed to save food item.", "error");
    }
}

async function toggleFoodAvailability(id, currentStatus) {
    try {
        await apiRequest(`/menu/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ available: !currentStatus })
        });
        await loadFoods();
        showToast("Food availability updated.", "success");
    } catch (error) {
        showToast(error.message, "error");
    }
}

// ==========================================
// DELETE HANDLING
// ==========================================

let deleteTarget = { type: null, id: null };

function openDeleteModal(type, id) {
    deleteTarget = { type, id };
    document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
    deleteTarget = { type: null, id: null };
    document.getElementById("deleteModal").classList.add("hidden");
}

async function executeDelete() {
    if (!deleteTarget.id) return;

    try {
        if (deleteTarget.type === 'food') {
            await apiRequest(`/menu/${deleteTarget.id}`, { method: "DELETE" });
            await loadFoods();
            showToast("Food deleted successfully.", "success");
        } else if (deleteTarget.type === 'room') {
            await apiRequest(`/rooms/${deleteTarget.id}`, { method: "DELETE" });
            await loadRooms();
            await loadRoomStats();
            showToast("Room deleted successfully.", "success");
        }
        closeDeleteModal();
    } catch (error) {
        showToast(error.message, "error");
    }
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ==========================================
// STATUS BADGE
// ==========================================

function statusBadge(status) {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-blue-100 text-blue-800",
        CHECKED_IN: "bg-green-100 text-green-800",
        CHECKED_OUT: "bg-gray-100 text-gray-800",
        CANCELLED: "bg-red-100 text-red-800",
        PREPARING: "bg-orange-100 text-orange-800",
        READY: "bg-blue-100 text-blue-800",
        SERVED: "bg-green-100 text-green-800",
        AVAILABLE: "bg-green-100 text-green-800",
        OCCUPIED: "bg-blue-100 text-blue-800",
        RESERVED: "bg-orange-100 text-orange-800",
        MAINTENANCE: "bg-red-100 text-red-800"
    };
    return `<span class="px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}">${status}</span>`;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `px-5 py-3 rounded-lg shadow-lg text-white text-sm ${type === "error" ? "bg-red-600" : "bg-green-600"} transform transition-all duration-300`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// EVENT LISTENERS - FIXED (Page-specific)
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    console.log(`📄 Current page: ${currentPage}`);
    
    // Always load admin info if user exists
    loadAdminInfo();

    // If on login page, don't load any dashboard functions
    if (currentPage === 'login.html') {
        console.log("🔐 On login page - skipping dashboard functions");
        // Only setup logout if element exists
        document.getElementById("logoutBtn")?.addEventListener("click", logout);
        return; // EXIT HERE - Don't run dashboard functions
    }

    // Check if we're on the dashboard page
    const isDashboard = document.getElementById("statTotalRooms") !== null;
    const isRoomsPage = document.getElementById("roomsTableBody") !== null;
    const isFoodPage = document.getElementById("foodTableBody") !== null;
    const isReservationsPage = document.getElementById("reservationsTableBody") !== null;
    const isFoodOrdersPage = document.getElementById("foodOrdersTableBody") !== null;

    try {
        // ONLY run dashboard code if on dashboard page
        if (isDashboard) {
            console.log("🖥️ Loading dashboard...");
            await loadDashboard();
        }

        // ONLY run rooms code if on rooms page
        if (isRoomsPage) {
            console.log("🛏️ Loading rooms...");
            await loadRooms();
            document.getElementById("addRoomBtn")?.addEventListener("click", openRoomModal);
            document.getElementById("closeRoomModalBtn")?.addEventListener("click", closeRoomModal);
            document.getElementById("cancelRoomModalBtn")?.addEventListener("click", closeRoomModal);
            document.getElementById("roomModalBackdrop")?.addEventListener("click", closeRoomModal);
            document.getElementById("roomForm")?.addEventListener("submit", submitRoomForm);
        }

        // ONLY run food code if on food page
        if (isFoodPage) {
            console.log("🍽️ Loading food menu...");
            await loadFoods();
            document.getElementById("addFoodBtn")?.addEventListener("click", openFoodModal);
            document.getElementById("addMenuBtn")?.addEventListener("click", openFoodModal);
            document.getElementById("closeFoodModalBtn")?.addEventListener("click", closeFoodModal);
            document.getElementById("cancelFoodModalBtn")?.addEventListener("click", closeFoodModal);
            document.getElementById("foodModalBackdrop")?.addEventListener("click", closeFoodModal);
            document.getElementById("foodForm")?.addEventListener("submit", submitFoodForm);
        }

        // ONLY run reservations code if on reservations page
        if (isReservationsPage) {
            console.log("📋 Loading reservations...");
            await loadAllBookings();
        }

        // ONLY run food orders code if on food orders page
        if (isFoodOrdersPage) {
            console.log("📦 Loading food orders...");
            await loadAllFoodOrders();
        }

    } catch (error) {
        console.error("Error loading page:", error);
    }

    // Global event listeners (work on all pages)
    document.getElementById("cancelDeleteBtn")?.addEventListener("click", closeDeleteModal);
    document.getElementById("deleteModalBackdrop")?.addEventListener("click", closeDeleteModal);
    document.getElementById("confirmDeleteBtn")?.addEventListener("click", executeDelete);
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
});