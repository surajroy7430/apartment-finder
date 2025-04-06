
let firebaseURL = "https://apartment-finder-1fd59-default-rtdb.asia-southeast1.firebasedatabase.app/apartments";

let apartmentData = [];
document.addEventListener("DOMContentLoaded", async () => {
    apartmentData = await fetchApartments();
    console.log(apartmentData);
});

let fetchApartments = async () => {
    let listMsg = document.getElementById("listMsg");

    try {
        let res = await fetch(`${firebaseURL}/.json`);
        let data = await res.json();
        let apartments = Object.entries(data).map(([id, apartment]) => ({ id, ...apartment }));
        if (apartments.length === 0) {
            listMsg.textContent = "No apartments available!";
            listMsg.style.color = "red";
        }

        showApartments(apartments);

        return apartments;
    } catch (error) {
        listMsg.textContent = "Error fetching appartments";
        listMsg.style.color = "red";
    }
}

function showApartments(apartments) {
    let apartmentLists = document.getElementById("apartment-lists");
    apartmentLists.innerHTML = "";

    apartments.forEach(data => {
        let isAvailable = data.available === true ? "Available" : "Unavailable";
        apartmentLists.innerHTML += `
            <div class="apartment-card">
                <h3>Name: ${data.name}</h3>
                <p>Neighborhood: ${data.neighborhood}</p>
                <p>City: ${data.city}</p>
                <p>Number of Bedrooms: ${data.bedrooms}</p>
                <p>Number of Bathrooms: ${data.bathrooms}</p>
                <p>Price: $${data.price}</p>
                <p>Available: ${isAvailable}</p>
                <div class="card-btns">
                    <button class=edit-btn>Edit</button>
                    <button class=delete-btn onClick="deleteApartment(${data.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

async function addNewApartment() {}
async function editApartment() {}
async function deleteApartment(apartmentID) {
    try {
        await fetch(`${firebaseURL}/${apartmentID}.json`, {
            method: "DELETE"
        });

        apartmentData = await fetchApartments();
        console.log("Apartment deleted succussfully!");
    } catch (error) {
        console.log(error);
    }

}

async function searchApartments() {
    let searchInput = document.getElementById("searchInput").value.trim().toLowerCase();

    let searchedApartments = apartmentData.filter(el => 
        (el.name.trim().toLowerCase().includes(searchInput)) || 
        (el.neighborhood.trim().toLowerCase().includes(searchInput)) || 
        (el.city.trim().toLowerCase().includes(searchInput))
    );

    showApartments(searchedApartments);
}