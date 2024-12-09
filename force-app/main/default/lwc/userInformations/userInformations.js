import { LightningElement, wire, track } from 'lwc';
import getMyProfile from '@salesforce/apex/UserProfileController.getMyProfile';

export default class UserInfo extends LightningElement {
    @track email;

    connectedCallback() {
        this.email = sessionStorage.getItem('userEmail');

        this.showProfile = !!this.email;
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
    }else if (error) {
        console.error(error);
    }
}
}