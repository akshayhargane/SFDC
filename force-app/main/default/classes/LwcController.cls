global with sharing class LwcController {
  
    @AuraEnabled //(cacheable = true)
    global static  emailDataWithRec getEmailTemplate(string emailId, string recID){
        system.debug('emailId::'+emailId+' recID:'+recID);
        emailDataWithRec r1 = new emailDataWithRec();
        if(emailId!=null){
            for(EmailTemplate e1 : [SELECT id,Body,HtmlValue,Subject FROM EmailTemplate where id=:emailId]){
                r1.HtmlValue = e1.HtmlValue;
                r1.Subject = e1.Subject;
                r1.body = e1.Body;
            }
        }
        for(lead l1: [select id,email,Name From lead where id=:recID]){
            r1.name = l1.Name;
            r1.recEmail = l1.email;
        }
        return r1;
    }

 
    @AuraEnabled
    global static map<string,object> getAllEmailTemplate(){
        list<EmailTemplate> emailTempList = [SELECT Id,Name,HtmlValue,Subject,body,FolderName,IsActive FROM EmailTemplate WHERE IsActive =:TRUE];
        map<string,list<emailtempData>> emailData = new map<string,list<emailtempData>>();

        for(EmailTemplate e1: emailTempList){
            list<emailtempData> listEmailName = new list<emailtempData>();
            emailtempData etd = new emailtempData();
            if (emailData.containsKey(e1.FolderName)){
                listEmailName = emailData.get(e1.FolderName);
            }
            etd.tempId = e1.id;
            etd.tempName = e1.Name;
            etd.tempBody = e1.body;
            etd.tempHtmlValue = e1.HtmlValue;
            etd.tempSubject = e1.Subject;
            listEmailName.add(etd);
            emailData.put(e1.FolderName,listEmailName);
        }
        map<string,object> result = new map<string,object>();
        result.put('result',emailData);
        return result;
    }

    @AuraEnabled
    global static  boolean sendEmail(string emailId, string recID){
        System.debug('sendEmail::');
        System.debug('emailId::'+emailId+' recID::'+recID);
        List<Id> lstids= new List<Id>();
        lstids.add(recID);
        Messaging.MassEmailMessage mail = new Messaging.MassEmailMessage();
        mail.setTargetObjectIds(lstIds);
        mail.setTemplateId(emailId);
        Messaging.sendEmail(new Messaging.MassEmailMessage[] { mail });
        return true;
    }
    global class emailDataWithRec{
        @AuraEnabled
        global string HtmlValue;
        @AuraEnabled
        global string Subject;
        @AuraEnabled
        global string name;
        @AuraEnabled
        global string recEmail;
        @AuraEnabled
        global string body;
    }

    global class emailtempData{
        @AuraEnabled
        global string tempName;
        @AuraEnabled
        global string tempId;
        @AuraEnabled
        global string tempBody;
        @AuraEnabled
        global string tempHtmlValue;
        @AuraEnabled
        global string tempSubject;
    }

    
}