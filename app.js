document.addEventListener("DOMContentLoaded", function () {

    const matches = {
        "01": {
            name: "CSK vs MI",
            prices: { General: 1200, Premium: 2500, VIP: 5000 }
        },
        "02": {
            name: "RCB vs KKR",
            prices: { General: 1000, Premium: 2200, VIP: 4500 }
        },
        "03": {
            name: "MI vs RCB",
            prices: { General: 1300, Premium: 2800, VIP: 5500 }
        },
        "04": {
            name: "CSK vs RCB",
            prices: { General: 1100, Premium: 2400, VIP: 4800 }
        },
        "05": {
            name: "KKR vs MI",
            prices: { General: 900, Premium: 2000, VIP: 4200 }
        },
        "06": {
            name: "SRH vs CSK",
            prices: { General: 1000, Premium: 2300, VIP: 4500 }
        },
        "07": {
            name: "DC vs RCB",
            prices: { General: 800, Premium: 1800, VIP: 4000 }
        },
        "08": {
            name: "GT vs RR",
            prices: { General: 900, Premium: 2100, VIP: 4300 }
        }
    };

    const bookingForm = document.getElementById("bookingForm");
    const matchSelect = document.getElementById("match");
    const standSelect = document.getElementById("stand");
    const ticketsInput = document.getElementById("tickets");

    const summaryMatch = document.getElementById("summaryMatch");
    const summaryStand = document.getElementById("summaryStand");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryQuantity = document.getElementById("summaryQuantity");
    const summaryTotal = document.getElementById("summaryTotal");

    const bookingRecords = document.getElementById("bookingRecords");
    const emptyMessage = document.querySelector(".empty-message");

    function formatPrice(amount) {
        return "₹" + amount.toLocaleString("en-IN");
    }

    function updateSummary() {
        const matchId = matchSelect.value;
        const stand = standSelect.value;
        const match = matches[matchId];

        if (!match) return;

        let quantity = Number(ticketsInput.value);

        if (!Number.isFinite(quantity) || quantity < 1) {
            quantity = 1;
        }

        if (quantity > 10) {
            quantity = 10;
        }

        const price = match.prices[stand];
        const total = price * quantity;

        summaryMatch.textContent = match.name;
        summaryStand.textContent = stand;
        summaryPrice.textContent = formatPrice(price);
        summaryQuantity.textContent = quantity;
        summaryTotal.textContent = formatPrice(total);
    }

    matchSelect.addEventListener("change", updateSummary);
    standSelect.addEventListener("change", updateSummary);
    ticketsInput.addEventListener("input", updateSummary);

    document.querySelectorAll(".book-button").forEach(function (button) {
        button.addEventListener("click", function () {
            matchSelect.value = button.dataset.match;
            updateSummary();

            document.getElementById("booking").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

   
    const teamFilter = document.getElementById("team");

    if (teamFilter) {
        teamFilter.addEventListener("change", function () {
            const selectedTeam = teamFilter.value;

            document.querySelectorAll("#matchTable tr").forEach(function (row) {
                const teams = row.dataset.teams || "";

                row.style.display =
                    selectedTeam === "all" ||
                    teams.split(" ").includes(selectedTeam)
                        ? ""
                        : "none";
            });
        });
    }

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const matchId = matchSelect.value;
        const stand = standSelect.value;
        const quantity = Number(ticketsInput.value);
        const match = matches[matchId];

        if (!match || !Number.isInteger(quantity) ||
            quantity < 1 || quantity > 10) {
            alert("Please select a valid match and ticket quantity (1–10).");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!name || !email || !/^[0-9]{10}$/.test(phone)) {
            alert("Please enter valid booking details.");
            return;
        }

        const price = match.prices[stand];
        const total = price * quantity;
        const bookingId = "IPL" + Date.now().toString().slice(-8);

        const row = document.createElement("tr");

        [
            bookingId,
            match.name,
            stand,
            quantity,
            formatPrice(total)
        ].forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        bookingRecords.appendChild(row);

        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        alert(
            "Booking confirmed!\n" +
            "Booking ID: " + bookingId + "\n" +
            "Match: " + match.name + "\n" +
            "Tickets: " + quantity + "\n" +
            "Total: " + formatPrice(total)
        );

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        ticketsInput.value = 1;

        updateSummary();
    });

    updateSummary();

});