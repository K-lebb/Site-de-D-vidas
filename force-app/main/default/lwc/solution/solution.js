import { LightningElement, track, wire } from 'lwc';
import getSolution from '@salesforce/apex/SolutionController.getSolution';

export default class Solution extends LightningElement {
    @track products = [];
    @track error;
    @track doutId;
    @track email;

    connectedCallback() {
        const queryParams = new URL(window.location.href).searchParams;
        this.doutId = queryParams.get('id');
        this.email = sessionStorage.getItem('userEmail') || 'Email não disponível';

        console.log('Email capturado na solução:', this.email);

        console.log('Id capturado na solução:', this.doutId);
    }

    @wire(getSolution, { doubtID: '$doutId' })
    wiredSolutions({ error, data }) {
        if (data) {
            this.products = data.map(solution => ({
                id: solution.Id,
                solucao: solution.SolucaoText__c,
                dono: solution.Dono__r.Name
            }));
            this.error = undefined;
            console.log('Soluções carregadas:', this.products);
    } else if (error) {
        this.error = 'Erro ao carregar as soluções. Tente novamente mais tarde.';
        console.error('Erro ao buscar soluções:', error);
        this.products = [];
    }
}

}