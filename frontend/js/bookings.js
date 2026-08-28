async function loadBookings() {
  try {
    const data = await apiRequest("/bookings");

    const bookings = data.bookings;

    const container = document.getElementById("bookings");

    container.innerHTML = "";

    bookings.forEach((booking) => {

      const card = document.createElement("div");

      card.innerHTML = `
        <h3>Room ${booking.room.roomNumber}</h3>

        <p>
          Check in:
          ${new Date(booking.checkIn).toLocaleDateString()}
        </p>

        <p>
          Check out:
          ${new Date(booking.checkOut).toLocaleDateString()}
        </p>

        <p>
          Total:
          ${booking.totalPrice} ETB
        </p>

        <p>
          Status:
          ${booking.status}
        </p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
  }
}

loadBookings();