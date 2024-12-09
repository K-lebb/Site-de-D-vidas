import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getMyDoubts from '@salesforce/apex/UserProfileController.getMyDoubts';
import deleteDoubtRecord from '@salesforce/apex/UserProfileController.deleteDoubtRecord'; // Import da função Apex

export default class MyDoubts extends NavigationMixin(LightningElement) {
    @track products = [];
    @track email = '';

    connectedCallback() {
        this.email = sessionStorage.getItem('userEmail') || 'Email não disponível'; 
        console.log('Email carregado:', this.email);
    }

    @wire(getMyDoubts, { email: '$email' })
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => ({
                id: product.Id,
                titulo: product.Titulo__c,
                duvida: product.DuvidaText__c, 
                status: product.Status__c,
                dono: product.Dono__c
            }));
        } else if (error) {
            console.error('Erro ao buscar as dúvidas:', error);
        }
    }

    deleteDoubt(event) {
        const doubtId = event.target.dataset.id; 

        if (!doubtId) {
            console.error('ID inválido para exclusão.');
            return;
        }

        deleteDoubtRecord({ recordId: doubtId })
            .then(() => {
                this.products = this.products.filter(product => product.id !== doubtId);
                window.location.reload();
                console.log('Registro apagado com sucesso. ID:', doubtId);
            })
            .catch(error => {
                console.error('Erro ao apagar o registro:', error);
            });
    }
}