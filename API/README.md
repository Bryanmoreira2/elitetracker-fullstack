# EliteTracker API

API desenvolvida para o **EliteTracker**, um sistema completo de rastreamento de hábitos e foco pessoal, com autenticação via GitHub. A aplicação tem como objetivo oferecer aos usuários uma forma eficiente de monitorar seus hábitos diários e tempos de concentração, fornecendo estatísticas detalhadas e insights mensais.

---

## 🧠 Jornada do Usuário

A jornada do usuário pode ser visualizada no seguinte diagrama:  
🔗 [Excalidraw - Jornada do Usuário](https://excalidraw.com/#json=z9weAUwVwEuRexxsfHx-R,nGnWiDY8yTrPwBA3mAnpyg)

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express.js**
- **MongoDB**
- **JWT** (Autenticação)
- **GitHub OAuth**
- **Zod** (validação de schemas)
- **React + TypeScript** _(Frontend - repositório separado)_

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Bryanmoreira2/elitetracker-api.git

# Acesse o diretório
cd elitetracker-api

# Instale as dependências
npm install

# Crie um arquivo .env com suas variáveis de ambiente
cp .env.example .env

# Inicie o servidor
npm run dev
```

---

## 🔐 Autenticação

A autenticação é feita via GitHub + JWT:

- `POST /auth`: Inicia o processo de login com GitHub.
- O token JWT gerado tem duração de **8 horas**.
- Após esse tempo, o usuário é automaticamente deslogado.

---

## 📘 Requisitos Funcionais (RFs)

- ✅ Login com GitHub
- ✅ Logout da aplicação
- ✅ Criar novo hábito
- ✅ Listar hábitos do usuário
- ✅ Excluir hábito
- ✅ Marcar e desmarcar hábito como concluído
- ✅ Visualizar estatísticas dos hábitos
- ✅ Criar tempo de foco
- ✅ Criar tempo de descanso
- ✅ Visualizar estatísticas mensais e diárias de foco

---

## 🔒 Regras de Negócio (RNs)

- Sessão expira após **8 horas**
- Não é permitido cadastrar dois hábitos com o **mesmo nome** (case insensitive)
- O usuário **só pode interagir com seus próprios hábitos e tempos**
- Apenas o criador pode visualizar estatísticas de seus hábitos e focos

---

## 🧩 Requisitos Não Funcionais (RNFs)

- Autenticação via GitHub + JWT
- Backend com **TypeScript** e **Express.js**
- Frontend com **React + TypeScript**
- Banco de dados **MongoDB**

---

## 🧪 Endpoints da API

### 📂 Hábitos

| Método | Rota                                  | Descrição                                  |
| ------ | ------------------------------------- | ------------------------------------------ |
| POST   | `/habits`                             | Cria um novo hábito                        |
| GET    | `/habits`                             | Lista todos os hábitos do usuário          |
| DELETE | `/habits/:id`                         | Exclui um hábito                           |
| PATCH  | `/habits/:id/toggle`                  | Marca/desmarca o hábito como concluído     |
| GET    | `/habits/:id/metrics`                 | Estatísticas gerais de um hábito           |
| GET    | `/habits/:id/metrics?date=YYYY-MM-DD` | Estatísticas do hábito por data específica |

### ⏱️ Tempo de Foco

| Método | Rota                                         | Descrição                           |
| ------ | -------------------------------------------- | ----------------------------------- |
| POST   | `/focus-times`                               | Registra um tempo de foco concluído |
| GET    | `/focus-times/metrics/month?date=YYYY-MM-DD` | Estatísticas mensais de foco        |
| GET    | `/focus-times/metrics/day?date=YYYY-MM-DD`   | Estatísticas diárias de foco        |

### 👤 Usuário

| Método | Rota    | Descrição              |
| ------ | ------- | ---------------------- |
| POST   | `/auth` | Login via GitHub OAuth |

---

## 📁 Estrutura de Diretórios

```
src/
├── controllers/     # Controladores responsáveis por lidar com as requisições e respostas
├── routes/          # Definições das rotas da aplicação
├── middlewares/     # Funções intermediárias como autenticação, logs e validações
├── models/          # Modelos de dados (MongoDB/Mongoose)
├── utils/           # Funções auxiliares reutilizáveis
├── database/        # Arquivos de configuração (como conexão com banco de dados)
└── index.ts         # Arquivo principal que inicializa a aplicação
```

> 📁 Esta estrutura segue boas práticas de modularização e separação de responsabilidades para aplicações Node.js com Express e TypeScript.

---

## 🧑‍💻 Desenvolvedor

**Bryan Moreira**  
📸 [@bryanmoreira2](https://github.com/Bryanmoreira2)  
📧 [suporte@bryanmoreia.blog](mailto:suporte@bryanmoreia.blog)  
🌐 [www.bryanmoreira.com.br](http://www.bryanmoreira.com.br)
📚 [LinkedIn](www.linkedin.com/in/bryan-moreira-dev)
💼 Projeto com fins educacionais e práticos para produtividade pessoal.
