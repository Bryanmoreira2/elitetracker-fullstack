# 🧭 EliteTracker Full-Stack  


[![Licence](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#)
[![GitHub stars](https://img.shields.io/github/stars/bryanmoreira2/elitetracker-fullstack?style=for-the-badge&logo=github)](https://github.com/bryanmoreira2/elitetracker-fullstack/stargazers)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=githubactions)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)](#)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-NextGen-646CFF?style=for-the-badge&logo=vite)](#)

**Autor:** Bryan Moreira  
📸 [@bryanmoreira2](https://github.com/Bryanmoreira2) | 📧 [suporte@bryanmoreia.blog](mailto:suporte@bryanmoreia.blog) | 🌐 [www.bryanmoreira.com.br](http://www.bryanmoreira.com.br) | 💼 [LinkedIn](https://www.linkedin.com/in/bryan-moreira-dev)  
> Projeto com fins **educacionais e práticos para produtividade pessoal**

---

## 🌎 Visão Geral  

O **EliteTracker** é um sistema **Full-Stack** para rastreamento de hábitos, tempos de foco e atividades pessoais.  
Desenvolvido com arquitetura moderna, separa o **backend (API)** e o **frontend (SPA)** para garantir escalabilidade, manutenibilidade e clareza de código.

---

## 🧩 Tecnologias Utilizadas  

### 🔙 Backend (API)
- **Node.js + TypeScript**
- **Express.js** (ou similar)
- **JWT** para autenticação
- **OAuth GitHub** (via `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`)
- **Prettier**, **ESLint**, **TSConfig**
- **Arquitetura modular:** Controllers, Models, Middlewares, Utils  

### 🎨 Frontend (SPA)
- **Vite + TypeScript + React**
- **React Router** (rotas públicas e privadas)
- **Hooks customizados**
- **CSS Global e modular**
- **LocalStorage** para persistência do estado (token JWT)
- Organização em **screens, components e services**

---

## 📁 Estrutura de Pastas  

### 🧠 API
```sh
API/
├─ src/
│ ├─ @types/
│ ├─ controllers/
│ ├─ database/
│ ├─ middlewares/
│ ├─ models/
│ ├─ utils/
│ ├─ routes.ts
│ └─ server.ts
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md
```

shell
Copiar código

### 💻 SPA
```sh
SPA/
├─ src/
│ ├─ components/
│ ├─ hooks/
│ ├─ routes/
│ ├─ screens/
│ ├─ services/
│ └─ styles/
├─ .env
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

yaml
Copiar código

---

## ⚙️ Variáveis de Ambiente  

### 🔙 API (`/API/.env`)
```env
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
JWT_SECRET=""
JWT_EXPIRES_IN=""
```
💻 SPA (/SPA/.env.local)
```env
Copiar código
VITE_API_URL="http://localhost:4000"
VITE_LOCALSTORAGE_KEY="elitetracker"
```
🚀 Como Executar Localmente
Pré-requisitos
Node.js instalado

Banco de dados configurado (se aplicável)

Criar os arquivos .env conforme os exemplos acima

Passos
1️⃣ Clone o repositório

```bash
Copiar código
git clone https://github.com/bryanmoreira2/elitetracker-fullstack.git
cd elitetracker-fullstack
```
2️⃣ Configure e rode a API
```
bash
Copiar código
cd API
cp .env.example .env
npm install
npm run dev
```
3️⃣ Configure e rode a SPA
```
bash
Copiar código
cd ../SPA
cp .env.local.example .env.local
npm install
npm run dev
```
4️⃣ Acesse o frontend no navegador
```
👉 http://localhost:3000
A API deve estar em execução em http://localhost:4000.
```

🧠 Funcionalidades
✅ Login com GitHub OAuth
✅ Autenticação via JWT
✅ Criação, edição e exclusão de hábitos
✅ Rastreamento de tempo de foco (“focus time”)
✅ Proteção de rotas privadas
✅ Armazenamento seguro de sessão (localStorage)
✅ Estrutura modular e limpa

🛠️ Scripts
API
Comando	Descrição
npm run dev	Executa o servidor em modo desenvolvimento
npm run build	Compila TypeScript para produção
npm run start	Inicia o servidor de produção

SPA
Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento (Vite)
npm run build	Gera o build de produção
npm run preview	Testa o build localmente

🧩 Estrutura da Aplicação
Backend (API)
```
controllers/: lógica de negócio e endpoints

middlewares/: autenticação e validação

models/: esquemas e definição de dados

utils/: funções auxiliares
```
Frontend (SPA)
```
components/: interface reutilizável

hooks/: lógicas compartilhadas de estado

routes/: controle de navegação

screens/: páginas principais (auth, focus, habit)

services/api.ts: integração com a API

styles/: configuração de estilo global
```
🤝 Contribuindo
Faça fork deste repositório

Crie uma nova branch:
```
bash
Copiar código
git checkout -b feat/nova-funcionalidade
```
Faça suas alterações e commit:
```]
bash
Copiar código
git commit -m "feat: adiciona nova funcionalidade"
Faça push e abra um Pull Request
```

👨‍💻 Autor
Bryan Moreira
📸 @bryanmoreira2
📧 suporte@bryanmoreia.blog
🌐 www.bryanmoreira.com.br
📚 LinkedIn

💼 Projeto com fins educacionais e práticos para produtividade pessoal.


---

Posso gerar um arquivo `.zip` com este `README.md` e o `LICENSE` prontos para download direto.  
Quer que eu gere isso agora?
