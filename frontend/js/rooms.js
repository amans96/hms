let selectedRoom = null;


// ==========================================
// LOAD ROOMS
// ==========================================

async function loadRooms() {

    try {

        const data = await apiRequest("/rooms");

        console.log("API response:", data);

        const roomContainer =
            document.getElementById("roomContainer");

        if (!roomContainer) {
            console.error("roomContainer not found");
            return;
        }

        roomContainer.innerHTML = "";

        if (!data.rooms || data.rooms.length === 0) {

            roomContainer.innerHTML =
                "<p>No rooms available.</p>";

            return;
        }


        data.rooms.forEach((room) => {

            const roomCard =
                document.createElement("div");

            roomCard.className = "room-card";


            roomCard.innerHTML = `
              ${
        room.image
            ? `<img
                src="http://localhost:5000/${room.image}"
                alt="Room ${room.roomNumber}"
                class="room-image"
              >`
            : `<div class="room-image-placeholder">
                No image available
              </div>`
    }
                <h3>
                    Room ${room.roomNumber}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${room.type}
                </p>

                <p>
                    <strong>Price:</strong>
                    ${room.price} ETB / night
                </p>

                <p>
                    <strong>Status:</strong>
                    ${room.status}
                </p>

                ${
                    room.status === "AVAILABLE"

                    ? `
                        <button
                            class="book-btn"
                            onclick="openBookingModal('${room.id}')"
                        >
                            Book Now
                        </button>
                    `

                    : `
                        <button
                            class="book-btn"
                            disabled
                            style="background:#999; cursor:not-allowed;"
                        >
                            Not Available
                        </button>
                    `
                }
            `;


            roomContainer.appendChild(roomCard);

        });

    } catch (error) {

        console.error(
            "Failed to load rooms:",
            error
        );

        const roomContainer =
            document.getElementById("roomContainer");

        if (roomContainer) {

            roomContainer.innerHTML = `
                <p>
                    Failed to load rooms.
                    Please try again.
                </p>
            `;
        }
    }
}


// ==========================================
// OPEN BOOKING MODAL
// ==========================================

async function openBookingModal(roomId) {

    console.log("Selected room:", roomId);


    // Check login
    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login before making a reservation."
        );

        window.location.href = "login.html";

        return;
    }


    try {

        // Get room information
        const data =
            await apiRequest(`/rooms/${roomId}`);

        selectedRoom = data.room;


        if (!selectedRoom) {

            alert("Room not found.");

            return;
        }


        // Show room information
        const selectedRoomElement =
            document.getElementById("selectedRoom");


        selectedRoomElement.innerHTML = `
            <h3>
                Room ${selectedRoom.roomNumber}
            </h3>

            <p>
                Type: ${selectedRoom.type}
            </p>

            <p>
                Price:
                <strong>
                    ${selectedRoom.price} ETB / night
                </strong>
            </p>

            <p>
                Status:
                ${selectedRoom.status}
            </p>
        `;


        // Clear old form
        document
            .getElementById("bookingForm")
            .reset();


        // Clear old message
        hideBookingMessage();


        // Open modal
        document
            .getElementById("bookingModal")
            .classList.add("active");


    } catch (error) {

        console.error(
            "Failed to load selected room:",
            error
        );

        alert(
            error.message ||
            "Failed to load room information."
        );
    }
}


// ==========================================
// CLOSE BOOKING MODAL
// ==========================================

function closeBookingModal() {

    document
        .getElementById("bookingModal")
        .classList.remove("active");

    selectedRoom = null;
}


// ==========================================
// BOOKING FORM SUBMISSION
// ==========================================

async function submitBooking(event) {

    event.preventDefault();


    if (!selectedRoom) {

        showBookingMessage(
            "Please select a room.",
            "error"
        );

        return;
    }


    const checkIn =
        document.getElementById("checkIn").value;

    const checkOut =
        document.getElementById("checkOut").value;


    // Validate dates
    if (!checkIn || !checkOut) {

        showBookingMessage(
            "Please select check-in and check-out dates.",
            "error"
        );

        return;
    }


    if (checkOut <= checkIn) {

        showBookingMessage(
            "Check-out date must be after check-in date.",
            "error"
        );

        return;
    }


    const confirmButton =
        document.getElementById("confirmBookingBtn");


    try {

        confirmButton.disabled = true;

        confirmButton.textContent =
            "Booking...";


        hideBookingMessage();


        // ==========================================
        // SEND BOOKING TO BACKEND
        // ==========================================

        const data = await apiRequest(
            "/bookings",
            {
                method: "POST",

                body: JSON.stringify({
                    roomId: selectedRoom.id,
                    checkIn: checkIn,
                    checkOut: checkOut
                })
            }
        );


        console.log(
            "Booking created:",
            data
        );


        showBookingMessage(
            "Reservation created successfully!",
            "success"
        );


        // Reset form
        document
            .getElementById("bookingForm")
            .reset();


        // Close modal after 2 seconds
        setTimeout(() => {

            closeBookingModal();

            // Reload rooms in case status changed
            loadRooms();

        }, 2000);


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        showBookingMessage(
            error.message ||
            "Failed to create reservation.",
            "error"
        );


    } finally {

        confirmButton.disabled = false;

        confirmButton.textContent =
            "Confirm Booking";
    }
}


// ==========================================
// SHOW BOOKING MESSAGE
// ==========================================

function showBookingMessage(
    text,
    type
) {

    const message =
        document.getElementById("bookingMessage");


    message.textContent = text;

    message.className =
        `booking-message ${type}`;
}


// ==========================================
// HIDE BOOKING MESSAGE
// ==========================================

function hideBookingMessage() {

    const message =
        document.getElementById("bookingMessage");

    message.textContent = "";

    message.className =
        "booking-message";
}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE MODAL
// ==========================================

document
    .getElementById("bookingModal")
    .addEventListener(
        "click",
        (event) => {

            if (
                event.target.id ===
                "bookingModal"
            ) {

                closeBookingModal();
            }
        }
    );


// ==========================================
// CLOSE BUTTON
// ==========================================

document
    .getElementById("closeBookingModal")
    .addEventListener(
        "click",
        closeBookingModal
    );


// ==========================================
// FORM SUBMIT
// ==========================================

document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        submitBooking
    );


// ==========================================
// LOAD ROOMS WHEN PAGE OPENS
// ==========================================

loadRooms();