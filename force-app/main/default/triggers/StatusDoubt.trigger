trigger StatusDoubt on Duvida__c (before insert, before update) {
    // Coletar IDs das dúvidas em Trigger.new
    Set<Id> duvidaIds = new Set<Id>();
    for (Duvida__c duvida : Trigger.new) {
        if (duvida.Id != null) {
            duvidaIds.add(duvida.Id);
        }
    }

    // Consultar soluções vinculadas às dúvidas
    Map<Id, Solucao__c> duvidaSolucaoMap = new Map<Id, Solucao__c>();
    if (!duvidaIds.isEmpty()) {
        for (Solucao__c solucao : [SELECT Id, DuvidaText__c FROM Solucao__c WHERE DuvidaText__c IN :duvidaIds]) {
            duvidaSolucaoMap.put(solucao.DuvidaText__c, solucao);
        }
    }

    // Atualizar o status da dúvida com base na existência de soluções
    for (Duvida__c duvida : Trigger.new) {
        if (duvidaSolucaoMap.containsKey(duvida.Id)) {
            duvida.Status__c = 'Respondido';
        } else {
            duvida.Status__c = 'Pendente';
        }
    }
}