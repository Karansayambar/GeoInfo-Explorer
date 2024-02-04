document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pincode = urlParams.get('pincode');
    const ip = urlParams.get('ip');

    document.getElementById('ip-address').textContent = ip || '127.0.0.1';

    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Update latitude and longitude on the page
                document.getElementById('latitude').textContent = latitude.toFixed(6);
                document.getElementById('longitude').textContent = longitude.toFixed(6);

                // Fetch additional location details or update the map based on these coordinates
                fetchLocationDetails(latitude, longitude);
            },
            function (error) {
                console.error('Error getting location:', error.message);
                alert('Failed to get location. Please try again.');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchLocationDetails(latitude, longitude) {
    // Use reverse geocoding API to get additional location details
    fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
        .then(response => response.json())
        .then(data => {
            console.log('Reverse Geocoding API response:', data);

            // Check if the response has results
            if (data.city) {
                // Extract location details from the response
                const city = data.city || '';
                const region = data.state || '';
                const organisation = data.country || ''; // geocode.xyz may return country instead of suburb
                const hostname = ''; // geocode.xyz may not provide this information

                // Update location details on the page
                document.getElementById('city').textContent = city;
                document.getElementById('region').textContent = region;
                document.getElementById('organisation').textContent = organisation;
                document.getElementById('hostname').textContent = hostname;
            } else {
                console.error('No results found for reverse geocoding.');
                alert('Failed to fetch location details. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching reverse geocoding data:', error);
            alert('Failed to fetch location details. Please try again.');
        });
}
// Add this function to fetch post office details
function getPostOfficeDetails() {
    const selectedPostOffice = getSelectedPostOffice(); // Implement this function to get the selected post office
    if (!selectedPostOffice) {
        alert('Please select a post office first.');
        return;
    }

    // Fetch additional details about the selected post office using an API
    fetch(`https://api.postalpincode.in/pincode/${selectedPostOffice.Pincode}`)
        .then(response => response.json())
        .then(data => {
            console.log('Post Office Details API response:', data);

            if (data && data[0] && data[0].PostOffice) {
                const postOfficeDetails = data[0].PostOffice[0];
                updatePostOfficeDetails(postOfficeDetails);
            } else {
                console.error('Invalid response from Post Office Details API.');
                alert('Failed to fetch post office details. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching post office details:', error);
            alert('Failed to fetch post office details. Please try again.');
        });
}

// Add this function to update the displayed post office details
function updatePostOfficeDetails(details) {
    document.getElementById('post-office-name').textContent = `Name: ${details.Name}`;
    document.getElementById('post-office-branch-type').textContent = `Branch Type: ${details.BranchType}`;
    document.getElementById('post-office-delivery-status').textContent = `Delivery Status: ${details.DeliveryStatus}`;
    document.getElementById('post-office-district').textContent = `District: ${details.District}`;
    document.getElementById('post-office-division').textContent = `Division: ${details.Division}`;

    // Display the container
    document.getElementById('post-office-details-container').style.display = 'block';
}

// Add this function to get the selected post office from the list
function getSelectedPostOffice() {
    const postOfficeList = document.getElementById('post-office-list');
    const selectedPostOfficeIndex = postOfficeList.selectedIndex;

    if (selectedPostOfficeIndex !== -1) {
        return postOffices[selectedPostOfficeIndex];
    } else {
        return null;
    }
}


function displayPostOffices(postOffices) {
    const postOfficeList = document.getElementById('post-office-list');
    postOfficeList.innerHTML = '';

    if (postOffices.length === 0) {
        const noResultsMessage = document.createElement('li');
        noResultsMessage.textContent = 'No post offices found.';
        postOfficeList.appendChild(noResultsMessage);
    } else {
        postOffices.forEach(postOffice => {
            const listItem = document.createElement('li');
            listItem.textContent = postOffice.Name;
            postOfficeList.appendChild(listItem);
        });
    }
}

function filterPostOffices() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredPostOffices = postOffices.filter(postOffice =>
        postOffice.Name.toLowerCase().includes(searchTerm)
    );

    displayPostOffices(filteredPostOffices);
}
function displayPostOfficeDetails(postOfficeDetails) {
    const detailsContainer = document.getElementById('post-office-list-details');
    detailsContainer.innerHTML = '';

    postOfficeDetails.forEach(details => {
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'post-office-details';

        for (const key in details) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${key}:</strong> ${details[key]}`;
            detailsDiv.appendChild(p);
        }

        detailsContainer.appendChild(detailsDiv);
    });
    
}