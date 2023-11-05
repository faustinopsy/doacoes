class Doacao {
    constructor() {
        this.loadEvents();
        this.loadDonations();
    }
    loadEvents() {
        document.getElementById('save-btn').addEventListener('click', () => this.saveDonation());
        document.getElementById('clear-form-btn').addEventListener('click', () => this.clearForm());
        document.getElementById('edit-btn').addEventListener('click', () => this.editDonation());
        document.getElementById('delete-btn').addEventListener('click', () => this.deleteDonation());
    }
    saveDonation() {
        const pixKey = document.getElementById('pix-key').value;
        const foodName = document.getElementById('food-name').value;
        const foodValue = document.getElementById('food-value').value;
        const file = document.getElementById('food-image').files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            const donation = { pixKey, foodName, foodValue, foodImage: base64Image };
            this.addToTable(donation);
            this.saveToLocalStorage(donation);
            this.clearForm();
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            console.error('No image file selected.');
        }
    }
    
    addToTable(donation, index) {
        const donationTableBody = document.querySelector('#donation-list tbody');
        const row = donationTableBody.insertRow();

        row.innerHTML = `
            <td contenteditable="true" data-index="${index}" data-key="pixKey" id="pixKey">${donation.pixKey}</td>
            <td>*</td>
            <td contenteditable="true" data-index="${index}" data-key="foodName" id="foodName" >${donation.foodName}</td>
            <td contenteditable="true" data-index="${index}" data-key="foodValue" id="foodValue">${donation.foodValue}</td>
            <td><img src="${donation.foodImage}" alt="${donation.foodName}" style="width:100px"></td>
            <td><button data-index="${index}" class="delete-btn">Excluir</button></td>
        `;
        row.querySelector('.delete-btn').addEventListener('click', (event) => {
            this.deleteDonation(event.target.dataset.index);
        });
        Array.from(row.querySelectorAll('[contenteditable="true"]')).forEach(cell => {
            cell.addEventListener('blur', (event) => {
                this.editDonation(event.target.dataset.index, event.target.dataset.key, event.target.innerText);
            });
        });
    }
    editDonation(index, key, value) {
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations[index][key] = value;
        localStorage.setItem('donations', JSON.stringify(donations));
    }
    deleteDonation(index) {
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.splice(index, 1);
        localStorage.setItem('donations', JSON.stringify(donations));
        this.loadDonations(); 
    }
    saveToLocalStorage(donation) {
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.push(donation);
        localStorage.setItem('donations', JSON.stringify(donations));
    }
    loadDonations() {
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        document.querySelector('#donation-list tbody').innerHTML = '';
        donations.forEach((donation, index) => this.addToTable(donation, index));
    }
    clearForm() {
        document.getElementById('pix-key').value = '';
        document.getElementById('food-name').value = '';
        document.getElementById('food-value').value = '';
        document.getElementById('food-image').value = '';
    }
    sendDonationData(donation) {
        fetch('backend/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donation),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    fetchDonationData() {
        fetch('backend/api')
        .then(response => response.json())
        .then(data => {
            data.forEach(donation => {
                this.addToTable(donation);
                this.saveToLocalStorage(donation);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const doacao = new Doacao();
});
