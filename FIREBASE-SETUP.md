# 🔥 Configuração do Firebase para BonkPuter - Suggestion

## 📋 Pré-requisitos

1. Conta Google
2. Acesso ao Firebase Console

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em "Criar projeto"
3. Digite o nome: `BonkPuter - Suggestion`
4. Aceite os termos e continue
5. **Desabilite** Google Analytics (opcional)
6. Clique em "Criar projeto"

### 2. Ativar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: `us-central1`)
5. Clique em "Pronto"

### 3. Obter Credenciais

1. No menu lateral, clique em ⚙️ (Configurações) > "Configurações do projeto"
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique no ícone da web (</>) para adicionar app web
4. Digite o nome: `BonkPuter - Suggestion Web`
5. **NÃO** marque "Também configurar o Firebase Hosting"
6. Clique em "Registrar app"
7. Copie a configuração que aparece

### 4. Atualizar o Código

Substitua as credenciais no arquivo `src/services/firebase.ts`:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-real",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 5. Configurar Regras do Firestore

1. No Firestore Database, clique na aba "Regras"
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suggestions/{document} {
      allow read, write: if true; // Para desenvolvimento
    }
  }
}
```

3. Clique em "Publicar"

## ✅ Verificação

1. Execute `npm run dev`
2. Acesse http://localhost:5174/
3. Tente adicionar uma sugestão
4. Verifique no Firebase Console > Firestore Database se a coleção `suggestions` foi criada

## 🔒 Segurança (Produção)

Para produção, atualize as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suggestions/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Apenas usuários autenticados
    }
  }
}
```

## 🆘 Solução de Problemas

### Erro 400 (Bad Request)
- Verifique se as credenciais estão corretas
- Confirme se o projeto existe no Firebase Console

### Erro de Permissão
- Verifique as regras do Firestore
- Certifique-se de que a coleção `suggestions` pode ser criada

### Dados não aparecem
- Verifique se o Firestore está ativo
- Confirme se as regras permitem leitura

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique o console do navegador (F12)
2. Confirme se o Firebase está inicializado corretamente
3. Teste com as regras de teste primeiro 