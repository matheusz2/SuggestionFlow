# 🚀 Configurar Firebase em 5 minutos

## 1. Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique "Criar projeto"
3. Nome: `SuggestionFlow`
4. Continue (sem Google Analytics)
5. Clique "Criar projeto"

## 2. Ativar Firestore

1. Menu lateral → "Firestore Database"
2. Clique "Criar banco de dados"
3. Escolha "Modo de teste" (para desenvolvimento)
4. Localização: `us-central1` (ou mais próxima)
5. Clique "Pronto"

## 3. Obter Credenciais

1. Menu lateral → ⚙️ "Configurações do projeto"
2. Aba "Geral" → "Seus aplicativos"
3. Clique ícone web (</>)
4. Nome: `SuggestionFlow Web`
5. **NÃO** marque Firebase Hosting
6. Clique "Registrar app"
7. **COPIE** a configuração que aparece

## 4. Atualizar Código

Edite o arquivo `src/config/firebase-config.ts`:

```javascript
export const firebaseConfig = {
  apiKey: "sua-api-key-real",
  authDomain: "seu-projeto.firebaseapp.com", 
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 5. Configurar Regras

1. Firestore Database → Aba "Regras"
2. Substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suggestions/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Clique "Publicar"

## ✅ Testar

1. `npm run dev`
2. Acesse http://localhost:5174/
3. Adicione uma sugestão
4. Verifique no Firebase Console se aparece na coleção `suggestions`

## 🆘 Se der erro

- Verifique se as credenciais estão corretas
- Confirme se o Firestore está ativo
- Verifique as regras de segurança 