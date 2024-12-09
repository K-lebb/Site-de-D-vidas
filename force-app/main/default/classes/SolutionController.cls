global without sharing class SolutionController {

    @AuraEnabled(cacheable=true)
public static List<Solucao__c> getSolution(String doubtID) {
    if (String.isBlank(doubtID)) {
        throw new AuraHandledException('O parâmetro doubtID é obrigatório.');
    }

    try {
        List<Solucao__c> solutions = [
            SELECT Id, Dono__r.Name, DataPostagem__c, DuvidaText__c, SolucaoText__c FROM Solucao__c WHERE DuvidaText__c = :doubtID ORDER BY DataPostagem__c DESC];
        System.debug('Soluções encontradas: ' + solutions);

        return solutions;
    } catch (Exception e) {
        System.debug('Erro ao buscar soluções: ' + e.getMessage());
        throw new AuraHandledException('Erro ao buscar as soluções. Tente novamente mais tarde.');
    }
}


    @AuraEnabled
    public static void sendSolution(Map<String, Object> data) {
        System.debug('Dados recebidos: ');
        System.debug(data);
        if (data == null || !data.containsKey('email') || !data.containsKey('solucao')) {
            throw new AuraHandledException('Parâmetros incompletos. Certifique-se de que email e solução estão preenchidos.');
        }

        String email = (String) data.get('email');
        String titulo = (String) data.get('titulo');
        String solucao = (String) data.get('solucao');

        if (String.isBlank(email) || String.isBlank(solucao)) {
            throw new AuraHandledException('Os parâmetros email e solução não podem estar vazios.');
        }

        try {
            List<Usuario__c> userList = UserProfileController.getMyProfile(email);
            if (userList.isEmpty()) {
                throw new AuraHandledException('Usuário não encontrado.');
            }
            String userId = userList[0].Id;

            List<Duvida__c> doubtList = DoubtController.selectDoubts(titulo);
            if (doubtList.isEmpty()) {
                throw new AuraHandledException('Dúvida não encontrada.');
            }
            String doubtId = doubtList[0].Id;

            Solucao__c solution = new Solucao__c();
            solution.DuvidaText__c = doubtId;
            solution.SolucaoText__c = solucao;
            solution.Dono__c = userId;

            insert solution;

            System.debug('Solução salva com sucesso: ' + solution);

        } catch (AuraHandledException e) {
            System.debug('Erro específico: ' + e.getMessage());
            throw e; 
        } catch (Exception e) {
            System.debug('Erro genérico: ' + e.getMessage());
            throw new AuraHandledException('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
    }
}