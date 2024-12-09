import { LightningElement } from 'lwc';
import logoDuvida from '@salesforce/resourceUrl/logoDuvida'; 

export default class logo extends LightningElement {
    logoUrl = logoDuvida; 

    reload(){
        window.location.reload();

    }
}