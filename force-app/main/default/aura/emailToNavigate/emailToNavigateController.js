({
    doInit : function(cmp, evt, helper) {
        var myPageRef = cmp.get("v.pageReference");
        var recID = myPageRef.state.c__recID;
        var emailTempId = myPageRef.state.c__emailTempId;
        cmp.set("v.recId", recID);
        cmp.set("v.emailTempId", emailTempId);
       // $A.get('e.force:refreshView').fire();
    }
})