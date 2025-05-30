# Documentação do Sistema PetSafe QR

## Visão Geral

O PetSafe QR é um sistema completo de gerenciamento para clínicas veterinárias, desenvolvido com tecnologias modernas para oferecer uma experiência de usuário superior e funcionalidades abrangentes. O sistema permite o gerenciamento de animais, geração de QR Codes, upload de documentos, agendamento de consultas e muito mais.

## Stack Tecnológica

- **Frontend**: React com Next.js, Tailwind CSS
- **Backend**: API Routes do Next.js
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Hospedagem Recomendada**: Vercel (frontend) e PlanetScale (banco de dados)

## Funcionalidades Principais

1. **Autenticação Segura**
   - Login e logout de clínicas veterinárias
   - Proteção de rotas autenticadas
   - Perfil e configurações da clínica

2. **Gerenciamento de Animais**
   - Cadastro completo com foto
   - Listagem com filtros e busca
   - Edição e exclusão de registros
   - Marcação de animal como perdido

3. **QR Code e Carteirinha**
   - Geração de QR Code para cada animal
   - Página pública acessível via QR Code
   - Carteirinha do pet para impressão

4. **Documentação do Pet**
   - Upload de documentos (exames, vacinas)
   - Listagem e visualização de documentos
   - Download e exclusão de documentos

5. **Agendamento**
   - Gerenciamento de horários disponíveis
   - Solicitação de agendamentos via página pública
   - Confirmação ou cancelamento de agendamentos

6. **Relatórios e Extras**
   - Dashboard com estatísticas
   - Exportação de dados em CSV
   - Listagem de animais perdidos

## Requisitos de Sistema

- Node.js 18.x ou superior
- MySQL 8.0 ou superior
- NPM ou Yarn

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/petsafe-qr.git
cd petsafe-qr
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/petsafe_qr"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

### 4. Configure o banco de dados

```bash
# Gerar as migrações do Prisma
npx prisma migrate dev --name init

# Gerar o cliente Prisma
npx prisma generate
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O sistema estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
petsafe-next/
├── components/           # Componentes React reutilizáveis
│   ├── auth/             # Componentes relacionados à autenticação
│   ├── layout/           # Componentes de layout (header, sidebar, footer)
│   ├── pets/             # Componentes relacionados aos animais
│   ├── qrcode/           # Componentes para geração e exibição de QR Codes
│   ├── documents/        # Componentes para gerenciamento de documentos
│   ├── appointments/     # Componentes para agendamento
│   └── ui/               # Componentes de UI genéricos
├── pages/                # Páginas da aplicação e API Routes
│   ├── api/              # API Routes do Next.js
│   ├── auth/             # Páginas de autenticação
│   ├── dashboard/        # Páginas do dashboard administrativo
│   ├── pets/             # Páginas de gerenciamento de animais
│   ├── appointments/     # Páginas de agendamento
│   ├── reports/          # Páginas de relatórios
│   └── p/                # Páginas públicas acessíveis via QR Code
├── prisma/               # Schema e migrações do Prisma
├── public/               # Arquivos estáticos
├── styles/               # Estilos globais
└── lib/                  # Utilitários e funções auxiliares
```

## Implantação em Produção

### Opção 1: Vercel + PlanetScale

1. **Banco de Dados**:
   - Crie uma conta no [PlanetScale](https://planetscale.com/)
   - Crie um novo banco de dados
   - Obtenha a string de conexão

2. **Frontend**:
   - Crie uma conta no [Vercel](https://vercel.com/)
   - Importe o projeto do GitHub
   - Configure as variáveis de ambiente:
     - `DATABASE_URL`: String de conexão do PlanetScale
     - `NEXTAUTH_URL`: URL do seu site (ex: https://seu-site.vercel.app)
     - `NEXTAUTH_SECRET`: Chave secreta para autenticação

### Opção 2: Servidor Próprio

1. **Prepare o ambiente**:
   - Instale Node.js e MySQL
   - Configure o banco de dados MySQL

2. **Build do projeto**:
   ```bash
   npm run build
   # ou
   yarn build
   ```

3. **Inicie o servidor**:
   ```bash
   npm start
   # ou
   yarn start
   ```

## Primeiros Passos

1. Acesse o sistema com as credenciais padrão:
   - Email: admin@exemplo.com
   - Senha: senha123

2. Altere a senha padrão em "Perfil"

3. Comece cadastrando os animais

4. Gere QR Codes e carteirinhas para os pets

5. Configure agendamentos e explore as demais funcionalidades

## Suporte e Manutenção

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através do email: suporte@petsafeqr.com.br

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
