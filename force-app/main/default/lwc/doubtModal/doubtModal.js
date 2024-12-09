import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendDoubt from '@salesforce/apex/DoubtController.sendDoubt';

export default class DoubtModal extends LightningElement {
    modal = false;
    @track doubtID;
    @track titulo = '';
    @track duvida = '';
    @track email = '';

    openModal() {
        this.modal = true;
    }

    closeModal() {
        this.modal = false;
    }

    handleTituloChange(event) {
        this.titulo = event.target.value;
    }

    handleDoubtChange(event) {
        this.duvida = event.target.value;
    }

    connectedCallback() {
        this.email = sessionStorage.getItem('userEmail');
    }

    sendDoubtToApex() {
        if (!this.titulo || !this.duvida) {
            this.showToast('Erro', 'Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        const doubtData = {
            titulo: this.titulo,
            duvida: this.duvida,
            email: this.email
        };

        sendDoubt({ data: doubtData })
            .then(() => {
                this.showToast('Sucesso', 'Dúvida enviada com sucesso!', 'success');
                
                this.closeModal();
                window.location.reload();
            })
            .catch((error) => {
                const errorMessage = error.body ? error.body.message : 'Erro desconhecido';
                this.showToast('Erro', 'Erro ao enviar a dúvida: ' + errorMessage, 'error');
                console.error('Erro ao enviar a dúvida:', error);
            });

            
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}