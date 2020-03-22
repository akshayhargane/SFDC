/* eslint-disable no-console */
/* eslint-disable no-alert */
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement,api } from 'lwc';

export default class EmailTemplateIconLWC extends NavigationMixin(LightningElement) {
    @api recordId;
    @api emailTempId = '00X2w000000tTLe';
    handleEmailTemplate(){
        console.log('BeforeReload');
        //location.reload(true);
        console.log('afterReload');
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__emailToNavigate'
            },
            state: {
                c__recID : this.recordId,
                c__emailTempId : this.emailTempId
            }
        });
    }
}