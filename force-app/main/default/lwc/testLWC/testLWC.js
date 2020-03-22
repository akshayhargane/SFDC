/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
/* eslint-disable @lwc/lwc/no-inner-html */

import { LightningElement  ,wire, track} from 'lwc';
import getEmailTemplate from '@salesforce/apex/LwcController.getEmailTemplate'

export default class TestLWC extends LightningElement {
    
    @track HtmlValue;   
    @track subject;
    @track Body;
    
    @wire(getEmailTemplate)
    getTemplate({data,error}){
        if(data){
            this.HtmlValue = data.HtmlValue;    
            this.subject = data.Subject;
            this.Body = data.Body;
            console.log('data::'+JSON. stringify(data));
        }else if(error){
            console.log('error::'+JSON. stringify(error));
        }
    }
    addInput() {
        console.log('data::'+this.HtmlValue);
        const container = this.template.querySelector('.container');
        //container.innerHTML = '<i><b>hh<b></i>';
        container.innerHTML = this.HtmlValue;
    }
}