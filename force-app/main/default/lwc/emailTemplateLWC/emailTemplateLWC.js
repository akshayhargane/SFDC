/* eslint-disable vars-on-top */
/* eslint-disable guard-for-in */
/* eslint-disable @lwc/lwc/no-inner-html */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { LightningElement , api ,wire, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getEmailTemplate from '@salesforce/apex/LwcController.getEmailTemplate';
import sendEmail from '@salesforce/apex/LwcController.sendEmail';
import getAllEmailTemplate from '@salesforce/apex/LwcController.getAllEmailTemplate';


export default class EmailTemplateLWC extends LightningElement {
    @api recordId;
    @api emailTempId;
    @track showBody;
    @track HtmlValue;
    @track to;
    @track showHtmlBody = true;
    @track cc;
    @track bcc;
    @track subj;
    @track inputBody;
    @track emaildata;
    @track openmodel = false;
    @track showEmail = false;
    @track emailFolder;
    @track options;
    @track allEmailName;
    allEmailName;

    constructor(){
        super();
        console.log('@@@@aaaaaaaaaa');
        
    }
    handleChange(event) {
        const val = event.target.value;
        const name = event.target.name;
        if(name === 'to'){
            this.to = val;
        }else if(name === 'cc'){
            this.cc = val;
        }else if(name === 'bcc'){
            this.bcc = val;
        }else if(name === 'subj'){
            this.subj = val;
        }else if(name === 'inputBody'){
            this.inputBody = val;
        }else if(name === 'emailFolder'){
            this.emailFolder = val;
        }
        console.log(name+'::'+val);
    }

    SelectTemplate(event){
        const val = event.target.value;
       // alert('val::'+val);
        for (var prop in this.allEmail) { 
            let allTempData = this.allEmail[prop];
            if(val === allTempData.tempName){
                console.log('@@@@!!!'+JSON.stringify(allTempData.tempSubject));
                this.subj = allTempData.tempSubject;
                this.emailTempId = allTempData.tempId;
                if(allTempData.tempHtmlValue){
                    this.showHtmlBody = true;
                    this.showBody = false;
                    const container = this.template.querySelector('.container');
                    container.innerHTML = allTempData.tempHtmlValue; 
                    this.inputBody = undefined;
                }else if(allTempData.tempBody){
                    this.showBody = true;
                    this.showHtmlBody = false;
                    this.inputBody = allTempData.tempBody;
                }else{
                   // this.showBody = true;
                }
            }   
        }
        
        this.allEmailName = undefined;
        this.openmodel = false;
    }

    handleSelectEmailFolder(event){
        const val = event.target.value;
        //console.log('Email Folder::'+val);
       // console.log('@@@@!!!'+JSON.stringify(this.emaildata.result[val]));
        this.allEmail = this.emaildata.result[val];
        var items = [];
        for (var prop in this.allEmail) { 
            let allTempData = this.allEmail[prop];
            items.push(allTempData.tempName);
        }
        if(items){
            this.showEmail = true;
            this.allEmailName = items; 
        }
    }

    @wire(getEmailTemplate,{emailId :'$emailTempId',recID:'$recordId'})
    getTemplate({data,error}){
       
        if(data){
            refreshApex(this);
            this.HtmlValue = data.HtmlValue;    
            this.subj = data.Subject;
            this.to = data.recEmail;
            if(this.HtmlValue){
                this.showBody = false;
                this.showHtmlBody = true;
                const container = this.template.querySelector('.container');
                container.innerHTML = this.HtmlValue;
               
            }else if(this.inputBody){
                this.showBody = true;
                this.showHtmlBody = false;
                this.inputBody =  data.body;
            }  
        }else if(error){
            console.log('error::'+JSON.stringify(error));
        }
    }

    handleSendEmail(){
        sendEmail({
            emailId: this.emailTempId,
            recID: this.recordId
        })
        .then(() => {
            return refreshApex(this.LwcController);
        })
        .catch((error) => {
            this.message = 'Error received: code' + error.errorCode + ', message ' + error.body.message;
        });
    }

    closeModal() {
        this.allEmailName = undefined;
        this.openmodel = false
    } 
    saveMethod() {
        alert('save method invoked');
        this.closeModal();
    }
    handleSelectTemplate(){
        getAllEmailTemplate({
        })
        .then(result => {
            refreshApex(this.LwcController);
            this.emaildata = result;
            var items = [];
           // console.log('All Email'+JSON.stringify(result));
           for (var prop in result.result) { 
          // console.log('@@@@1'+JSON.stringify(result.result[prop])); 
            var item = {
                "label": prop,
                "value": prop
            };
            items.push(item);
           }
          // console.log('@@@@111'+JSON.stringify(items)); 
           this.options = items;
           this.openmodel = true
            return refreshApex(this.LwcController);
        })
        .catch((error) => {
            this.message = 'Error received: code' + error.errorCode + ', message ' + error.body.message;
        });
    }
}