import { LightningElement, wire, track } from 'lwc';
import getMyProfile from '@salesforce/apex/UserProfileController.getMyProfile';

export default class Profile extends LightningElement {
    @track products = [];
    @track email = '';
    @track username = '';


    connectedCallback() {
        this.email = sessionStorage.getItem('userEmail');
    }

    @wire(getMyProfile, { email: '$email' })
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => ({
                id: product.Id,
                nome: product.Name,
                username: product.UserName__c,
                email: this.email
            }));

            if (this.products.length > 0) {
                this.userName = this.products[0].username || 'Usuário Desconhecido';
            }
        } else if (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    }
}