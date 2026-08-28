const API_URL = "http://localhost:5000/api";
console.log("home page is loadinf");
// ==========================================
// LOAD ROOMS
// ==========================================

async function loadRooms() {
    const container = document.getElementById("roomsContainer");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/rooms`);

        if (!response.ok) {
            throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();

        const rooms = Array.isArray(data)
            ? data
            : data.rooms || [];

        if (rooms.length === 0) {
            container.innerHTML = `
                <p class="col-span-3 text-center text-gray-500">
                    No rooms available.
                </p>
            `;
            return;
        }

        container.innerHTML = rooms
            .filter(room => room.status === "AVAILABLE")
            .slice(0, 3)
            .map(room => {
                return `
                    <div class="bg-white rounded-sm overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300">

                        <div class="h-64 bg-gray-100 flex items-center justify-center">
                            <span class="text-gray-400 text-5xl">🛏️</span>
                        </div>

                        <div class="p-8">

                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-2xl font-light">
                                    ${escapeHTML(room.type)}
                                </h3>

                                <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                                    Available
                                </span>
                            </div>

                            <p class="text-gray-600 mb-2 text-sm">
                                Room ${escapeHTML(room.roomNumber)}
                            </p>

                            <p class="text-gray-600 mb-6 text-sm">
                                Comfortable room for your stay.
                            </p>

                            <div class="flex justify-between items-end border-t border-gray-100 pt-6">

                                <div>
                                    <span class="block text-xs text-gray-500 uppercase tracking-wide">
                                        Starting at
                                    </span>

                                    <span class="text-xl font-medium text-charcoal">
                                        ${formatMoney(room.price)} ETB

                                        <span class="text-sm text-gray-500 font-normal">
                                            / night
                                        </span>
                                    </span>
                                </div>

                                <a
                                    href="rooms.html?id=${room.id}"
                                    class="text-sm px-5 py-2.5 bg-gold text-white rounded hover:bg-amber-800 transition-colors"
                                >
                                    Book Now
                                </a>

                            </div>

                        </div>
                    </div>
                `;
            })
            .join("");

    } catch (error) {

        console.error("Failed to load rooms:", error);

        container.innerHTML = `
            <p class="col-span-3 text-center text-red-500">
                Failed to load rooms.
            </p>
        `;
    }
}


// ==========================================
// LOAD MENU
// ==========================================

async function loadMenu() {

    const container = document.getElementById("menuContainer");

    if (!container) return;

    try {

        const response = await fetch(`${API_URL}/menu`);

        if (!response.ok) {
            throw new Error("Failed to fetch menu");
        }

        const data = await response.json();

        const foods = Array.isArray(data)
            ? data
            : data.foods || data.menu || data.items || [];

        if (foods.length === 0) {

            container.innerHTML = `
                <p class="col-span-4 text-center text-gray-500">
                    No menu items available.
                </p>
            `;

            return;
        }

        container.innerHTML = foods
            .filter(food => food.available !== false)
            .slice(0, 4)
            .map(food => {

                return `
                    <div class="bg-beige rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

                        ${
                            food.image
                                ? `
                                    <img
                                        src="${escapeHTML(food.image)}"
                                        alt="${escapeHTML(food.name)}"
                                        class="w-full h-48 object-cover"
                                    >
                                `
                                : `
                                    <div class="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">
                                        🍽️
                                    </div>
                                `
                        }

                        <div class="p-6">

                            <h3 class="text-xl font-medium mb-2">
                                ${escapeHTML(food.name)}
                            </h3>

                            <p class="text-sm text-gray-600 mb-4 h-10">
                                ${escapeHTML(food.description || "Delicious meal prepared by our kitchen.")}
                            </p>

                            <div class="flex justify-between items-center mt-auto">

                                <span class="font-semibold text-lg text-charcoal">
                                    ${formatMoney(food.price)} ETB
                                </span>

                                <button
                                    onclick="orderFood('${food.id}')"
                                    class="text-sm px-4 py-2 bg-charcoal text-white rounded hover:bg-gray-800 transition-colors"
                                >
                                    Order Now
                                </button>

                            </div>

                        </div>
                    </div>
                `;

            })
            .join("");

    } catch (error) {

        console.error("Failed to load menu:", error);

        container.innerHTML = `
            <p class="col-span-4 text-center text-red-500">
                Failed to load menu.
            </p>
        `;
    }
}


// ==========================================
// HELPERS
// ==========================================

function formatMoney(value) {

    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// ORDER FOOD
// ==========================================

function orderFood(foodId) {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

        return;
    }

    window.location.href = `menu.html?food=${foodId}`;
}


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadRooms();

    loadMenu();

});