# 🚀 SuggestionFlow

Um painel de sugestões colaborativo em tempo real, construído com React, TypeScript e Firebase.

## ✨ Funcionalidades

- ✅ **Sistema de Sugestões**: Criar, visualizar e gerenciar sugestões
- ✅ **Duas Visualizações**: Cards e Fórum
- ✅ **Sistema de Likes**: Votação em sugestões
- ✅ **Sistema de Destaque**: Marcar sugestões importantes
- ✅ **Filtros Avançados**: Por status, categoria e destaque
- ✅ **Tempo Real**: Atualizações instantâneas com Firebase
- ✅ **Interface Moderna**: Design responsivo com TailwindCSS
- ✅ **Estatísticas**: Dashboard com métricas em tempo real

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + HeadlessUI
- **Backend**: Firebase Firestore
- **Icons**: Lucide React
- **Real-time**: Firebase Realtime Database

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd SuggestionFlow
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Copie as credenciais do projeto
   - Edite o arquivo `src/services/firebase.ts` e substitua as credenciais

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração do Firebase

### Configuração Rápida:

1. **Copie o arquivo de exemplo:**
   ```bash
   cp src/config/firebase-config.example.ts src/config/firebase-config.ts
   ```

2. **Siga o guia detalhado:** `CONFIGURAR-FIREBASE.md`

### Ou configure manualmente:

1. **Crie um projeto Firebase**
   - Acesse [console.firebase.google.com](https://console.firebase.google.com/)
   - Clique em "Criar projeto"
   - Nome: `SuggestionFlow`

2. **Ative o Firestore**
   - Menu lateral → "Firestore Database"
   - Clique em "Criar banco de dados"
   - Escolha "Modo de teste" (para desenvolvimento)

3. **Obtenha as credenciais**
   - Menu lateral → ⚙️ "Configurações do projeto"
   - Aba "Geral" → "Seus aplicativos"
   - Clique no ícone web (</>) para adicionar app
   - Copie a configuração

4. **Configure o arquivo**
   - Edite `src/config/firebase-config.ts`
   - Substitua as credenciais de exemplo pelas reais

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── SuggestionCard.tsx
│   ├── ForumTopic.tsx
│   ├── SuggestionForm.tsx
│   ├── ViewSwitcher.tsx
│   └── FirebaseTest.tsx
├── pages/              # Páginas da aplicação
│   └── Home.tsx
├── services/           # Serviços e APIs
│   └── firebase.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx
└── index.css
```

## 🎯 Como Usar

### 1. **Criar uma Sugestão**
- Clique no botão "Nova Sugestão"
- Preencha o formulário com título, descrição e seu nome
- Adicione categoria e tags (opcional)
- Clique em "Enviar Sugestão"

### 2. **Visualizar Sugestões**
- **Modo Cards**: Visualização em grid de cards
- **Modo Fórum**: Visualização em lista estilo fórum
- Use o seletor no canto superior direito para alternar

### 3. **Interagir com Sugestões**
- **Like**: Clique no coração para curtir
- **Destaque**: Clique na estrela para destacar/desdestacar
- **Filtros**: Use os filtros para encontrar sugestões específicas

### 4. **Filtros Disponíveis**
- **Status**: Pendente, Aceita, Rejeitada
- **Categoria**: Melhoria, Bug, Feature, Design, Performance, Outro
- **Destaque**: Apenas sugestões destacadas

## 🔄 Sprints Implementados

### ✅ Sprint 1 - FUNDAÇÃO (COMPLETO)
- [x] Setup do projeto React + TypeScript + Vite
- [x] Configuração do TailwindCSS
- [x] Componente principal App.tsx
- [x] Página Home.tsx
- [x] Estrutura de pastas organizada
- [x] Configuração do Firebase
- [x] Serviço de conexão com Firestore
- [x] Funções CRUD básicas
- [x] Sistema de logs detalhado
- [x] Formulário de envio de sugestões
- [x] Listagem de sugestões
- [x] Sistema de likes
- [x] Sistema de destaque
- [x] Duas visualizações (cards/fórum)
- [x] Todos os componentes principais
- [x] Design responsivo
- [x] Interface moderna
- [x] Animações básicas
- [x] Cores e tipografia
- [x] Todos os arquivos .tsx
- [x] Tipos TypeScript definidos

## 🚧 Próximos Sprints

### 🔄 Sprint 2 - FUNCIONALIDADES ESSENCIAIS
- [ ] Melhorar visual do destaque
- [ ] Filtro por sugestões destacadas
- [ ] Contador de sugestões destacadas
- [ ] Animação de destaque
- [ ] Loading states mais elegantes
- [ ] Feedback de sucesso/erro melhorado
- [ ] Tooltips informativos
- [ ] Confirmações de ações
- [ ] Sistema de status completo
- [ ] Performance básica

### ⏳ Sprint 3 - ADMINISTRAÇÃO E CONTROLE
- [ ] Painel administrativo
- [ ] Modo admin com senha
- [ ] Dashboard de métricas
- [ ] Controle de destaque
- [ ] Moderação de sugestões

## 🐛 Solução de Problemas

### Erro de Conexão Firebase
1. Verifique se as credenciais estão corretas
2. Confirme se o Firestore está ativado
3. Verifique as regras de segurança do Firestore

### Problemas de Build
```bash
npm run build
```

### Limpar Cache
```bash
npm run dev -- --force
```

## 📝 Regras do Firestore

Para desenvolvimento, use estas regras básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE**: Estas regras permitem acesso total. Para produção, configure regras de segurança apropriadas.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção de solução de problemas
2. Abra uma issue no GitHub
3. Entre em contato com a equipe de desenvolvimento

---

**🎯 Objetivo**: Transformar o SuggestionFlow em uma plataforma completa e robusta para gestão de sugestões colaborativas.

**📅 Status**: Sprint 1 completo - Funcionalidades básicas implementadas e funcionando!
