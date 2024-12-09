global without sharing class UserProfileController {

    @AuraEnabled(cacheable=true)
public static List<Usuario__c> getMyProfile(String email) {
    if (String.isBlank(email)) {
        throw new AuraHandledException('Email não pode estar vazio.');
    }
    
    List<Usuario__c> userList = [SELECT Id, UserName__c, Name FROM Usuario__c WHERE Email__c = :email];
    return userList;
}


    @AuraEnabled(cacheable=true)
    public static List<Duvida__c> getMyDoubts(String email) {

        List<Usuario__c> userList = getMyProfile(email);
    
        if (userList.size() == 1) {
        
        String userId = userList[0].Id;

        List<Duvida__c> myDoubts = [
                SELECT Id, Titulo__c, DuvidaText__c, Status__c, DataPostagem__c, Dono__c 
                FROM Duvida__c 
                WHERE Dono__c = :userId
            ];

        System.debug('Doubts: ' + myDoubts);
        return myDoubts;
    } else {
        System.debug('Erro: Nenhum usuário ou mais de um encontrado para o email fornecido.');
        return new List<Duvida__c>();
    }
}
@AuraEnabled
public static void deleteDoubtRecord(Id recordId) {
    try {
        if (recordId == null) {
            throw new AuraHandledException('ID do registro não pode ser nulo.');
        }
        delete [SELECT Id FROM Duvida__c WHERE Id = :recordId];
    } catch (Exception e) {
        throw new AuraHandledException('Erro ao apagar o registro: ' + e.getMessage());
    }
}




}