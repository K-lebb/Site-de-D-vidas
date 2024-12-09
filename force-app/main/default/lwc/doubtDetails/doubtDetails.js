import { LightningElement, track } from 'lwc';
import sendSolution from '@salesforce/apex/SolutionController.sendSolution';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DoubtDetails extends LightningElement {
    @track titulo = '';
    @track duvida = '';
    @track status = '';
    @track dono = '';
    @track solucao = '';
    @track id = '';
    @track email = '';
    @track isModalOpen = false; // Controle do modal

    connectedCallback() {
        const queryParams = new URL(window.location.href).searchParams;
        this.titulo = queryParams.get('titulo');
        this.duvida = queryParams.get('duvida');
        this.id = queryParams.get('id');
        this.status = queryParams.get('status');
        this.dono = queryParams.get('dono');
        this.email = sessionStorage.getItem('userEmail') || 'Email não disponível';
    }

    handleSolutionChange(event) {
        this.solucao = event.target.value;
    }

    sendSolutionToApex() {
        if (!this.email || !this.duvida) {
            this.showToast('Erro', 'Preencha todos os campos obrigatórios', 'error');
            return;
        }

        const solutionData = {
            solucao: this.solucao,
            email: this.email,
            id: this.id,
            titulo: this.titulo,
        };

        sendSolution({ data: solutionData })
            .then(() => {
                this.showToast('Sucesso', 'Solução enviada com sucesso!', 'success');
                this.isModalOpen = true; // Abre o modal
            })
            .catch((error) => {
                const errorMessage = error.body ? error.body.message : 'Erro desconhecido';
                this.showToast('Erro', `Erro ao enviar a solução: ${errorMessage}`, 'error');
            });
    }

    closeModal() {
        this.isModalOpen = false; // Fecha o modal
        window.location.reload(); // Recarrega a página
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}