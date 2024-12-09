import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    @track selectedDoubt;

    handleDoubtSelected(event) {
        this.selectedDoubt = event.detail;
    }
}