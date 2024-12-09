import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getDoubts from '@salesforce/apex/DoubtController.getDoubts';

export default class ShowDoubts extends NavigationMixin(LightningElement) {
    @track products = [];

    @wire(getDoubts)
    wiredProducts({ errors, data }) {
        if (data) {
            this.products = data.map(product => ({
                id: product.Id,
                titulo: product.Titulo__c,
                duvida: product.DuvidaText__c,
                status: product.Status__c,
                dono: product.Dono__r.Name
            }));
        } else if (errors) {
            console.error('Erro ao buscar dúvidas:', errors);
        }
    }

    
    

    openDoubt(event) {
        const id = event.target.dataset.id;
        const selectedDoubt = this.products.find(product => product.id === id);

        if (selectedDoubt) {
            const queryParams = `titulo=${encodeURIComponent(selectedDoubt.titulo)}&duvida=${encodeURIComponent(selectedDoubt.duvida)}&status=${encodeURIComponent(selectedDoubt.status)}&id=${encodeURIComponent(selectedDoubt.id)}&dono=${encodeURIComponent(selectedDoubt.dono)}`;

            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `/duvidas-e-comentarios?${queryParams}`
                }
            });
        } else {
            console.error('Dúvida não encontrada para o ID:', id);
        }
    }
}