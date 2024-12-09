global without sharing class DoubtController {

    @AuraEnabled(cacheable=true)
public static List<Duvida__c> getDoubts() {
    List<Duvida__c> doubts = [SELECT Id, Titulo__c, DuvidaText__c, Status__c, DataPostagem__c, Dono__r.Name FROM Duvida__c ORDER BY DataPostagem__c DESC];
    System.debug('Doubts: ' + doubts);
    return doubts;
}


    @AuraEnabled(cacheable=true)
public static List<Duvida__c> selectDoubts(String tituloDuvida) {
    // Validação do parâmetro
    if (String.isBlank(tituloDuvida)) {
        throw new AuraHandledException('O título da dúvida não pode estar vazio.');
    }

    try {
        // Consulta SOQL
        List<Duvida__c> doubts = [
            SELECT Id, Titulo__c, DuvidaText__c, Status__c, DataPostagem__c, Dono__c 
            FROM Duvida__c 
            WHERE Titulo__c = :tituloDuvida
        ];

        System.debug('Dúvidas encontradas para o título "' + tituloDuvida + '": ' + doubts.size());
        return doubts;

    } catch (Exception e) {
        // Log detalhado e exceção
        System.debug('Erro ao buscar dúvidas: ' + e.getMessage());
        throw new AuraHandledException('Erro ao buscar dúvidas. Tente novamente mais tarde.');
    }
}

    
    
    @AuraEnabled
public static void sendDoubt(Map<String, Object> data) {
    String email = (String)data.get('email');
    List<Usuario__c> userList = UserProfileController.getMyProfile(email);

    if (userList.isEmpty()) {
        throw new AuraHandledException('Usuário não encontrado');
    }

    String userId = userList[0].Id;

    try {
        Duvida__c doubt = new Duvida__c();
        doubt.Titulo__c = (String)data.get('titulo');
        doubt.DuvidaText__c = (String)data.get('duvida');
        doubt.Dono__c = userId;  
        insert doubt;
    } catch (Exception e) {
        throw new AuraHandledException('Erro ao salvar dúvida: ' + e.getMessage());
    }
}


    public static void sendSolution(Map<String, Object> data) {
        try {
            Solucao__c solution = new Solucao__c();
            solution.DuvidaText__c = (String)data.get('usuario');
            
            insert solution;
        } catch (Exception e) {
            throw new AuraHandledException('Erro ao salvar dúvida: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
public static List<Duvida__c> getDoubtsID(String titulo) {
    return [
        SELECT Id, Titulo__c, DuvidaText__c, Status__c, Dono__c 
        FROM Duvida__c 
        WHERE Titulo__c = :titulo
    ];
}



}