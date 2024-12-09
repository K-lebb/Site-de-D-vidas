public with sharing class UserController {
    @AuraEnabled
    public static void createUser(Map<String, String> user) {
        if (String.isEmpty(user.get('Name')) || String.isEmpty(user.get('UserName')) ||
            String.isEmpty(user.get('Email')) || String.isEmpty(user.get('Password'))) {
            throw new AuraHandledException('Todos os campos são obrigatórios.');
        }

    }
}