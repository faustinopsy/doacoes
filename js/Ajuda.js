class Ajuda {
    constructor() {
        this.donationItemsContainer = document.getElementById('donation-items');
        this.loadDonationsFromLocalStorage();
    }
    loadDonationsFromLocalStorage() {
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        this.donationItemsContainer.innerHTML = '';

        donations.forEach(donation => {
            const donationItem = this.createDonationItem(donation);
            this.donationItemsContainer.appendChild(donationItem);
        });
    }
    createDonationItem(donation) {
        const itemContainer = document.createElement('div');
        const base64Image = donation.foodImage;
    
        itemContainer.innerHTML = `
            <div class="donation-item">
                <img src="${base64Image}" alt="${donation.foodName}" style="width:30%">
                <div class="donation-info">
                    <h3>${donation.foodName}</h3>
                    <p>Valor: ${donation.foodValue}</p>
                    <button class="donate-button" data-pix-key="${donation.pixKey}">Ajude agora</button>
                </div>
            </div>
        `;
        return itemContainer;
    }
    showDonationModal(pixKey) {
        console.log(`Mostrar modal para a chave PIX: ${pixKey}`);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const ajuda = new Ajuda();
});
