# PetSafe QR - Sistema de Gerenciamento para Clínicas Veterinárias

## Estrutura Modular do Sistema

### Visão Geral da Arquitetura
O PetSafe QR é desenvolvido como uma aplicação web moderna utilizando Next.js (React) com uma arquitetura modular que separa claramente as responsabilidades entre frontend e backend, enquanto mantém a integração eficiente entre os componentes.

### Stack Tecnológica
- **Frontend**: React com Next.js, Tailwind CSS, React Query
- **Backend**: API Routes do Next.js, Node.js/Express (quando necessário)
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Hospedagem**: Vercel (frontend) e PlanetScale (banco de dados)

### Estrutura de Diretórios
```
petsafe-next/
├── components/           # Componentes React reutilizáveis
│   ├── auth/             # Componentes relacionados à autenticação
│   ├── layout/           # Componentes de layout (header, sidebar, footer)
│   ├── pets/             # Componentes relacionados aos animais
│   ├── qrcode/           # Componentes para geração e exibição de QR Codes
│   ├── documents/        # Componentes para gerenciamento de documentos
│   ├── appointments/     # Componentes para agendamento
│   ├── ui/               # Componentes de UI genéricos
│   └── dashboard/        # Componentes do dashboard
├── pages/                # Páginas da aplicação e API Routes
│   ├── api/              # API Routes do Next.js
│   │   ├── auth/         # Endpoints de autenticação
│   │   ├── pets/         # Endpoints para gerenciamento de animais
│   │   ├── documents/    # Endpoints para documentos
│   │   ├── appointments/ # Endpoints para agendamentos
│   │   └── reports/      # Endpoints para relatórios
│   ├── dashboard/        # Páginas do dashboard administrativo
│   ├── pets/             # Páginas de gerenciamento de animais
│   ├── documents/        # Páginas de gerenciamento de documentos
│   ├── appointments/     # Páginas de agendamento
│   ├── settings/         # Páginas de configurações
│   ├── p/                # Páginas públicas acessíveis via QR Code
│   └── auth/             # Páginas de autenticação
├── styles/               # Estilos globais e configuração do Tailwind
├── lib/                  # Utilitários e funções auxiliares
│   ├── prisma/           # Cliente Prisma e utilitários de banco de dados
│   ├── auth/             # Utilitários de autenticação
│   ├── qrcode/           # Utilitários para geração de QR Code
│   └── pdf/              # Utilitários para geração de PDF (carteirinhas)
├── prisma/               # Schema e migrações do Prisma
│   ├── schema.prisma     # Definição do schema do banco de dados
│   └── migrations/       # Migrações do banco de dados
├── public/               # Arquivos estáticos
│   ├── images/           # Imagens estáticas
│   └── uploads/          # Diretório para uploads (em desenvolvimento)
├── middleware.ts         # Middleware do Next.js para proteção de rotas
├── next.config.js        # Configuração do Next.js
└── tailwind.config.js    # Configuração do Tailwind CSS
```

## Módulos do Sistema

### 1. Módulo de Autenticação
- **Funcionalidades**:
  - Login e logout de clínicas veterinárias
  - Registro de novas clínicas (opcional, pode ser administrativo)
  - Recuperação de senha
  - Perfil da clínica e configurações
  - Proteção de rotas autenticadas
- **Tecnologias**: NextAuth.js, JWT, bcrypt
- **Tabelas**: `clinics`, `users`

### 2. Módulo de Gerenciamento de Animais
- **Funcionalidades**:
  - Cadastro completo de animais com foto
  - Listagem com filtros e busca
  - Edição e exclusão de registros
  - Marcação de animal como perdido
  - Geração de QR Code
- **Tecnologias**: React Hook Form, React Query, QRCode.js
- **Tabelas**: `pets`, `species`, `breeds`

### 3. Módulo de QR Code e Página Pública
- **Funcionalidades**:
  - Geração de QR Code para cada animal
  - Página pública acessível via QR Code
  - Carteirinha do pet para impressão
- **Tecnologias**: QRCode.js, React-to-PDF
- **Tabelas**: Utiliza `pets`

### 4. Módulo de Documentação do Pet
- **Funcionalidades**:
  - Upload de documentos (exames, vacinas)
  - Listagem e visualização de documentos
  - Download e exclusão de documentos
- **Tecnologias**: React Dropzone, Next.js API Routes para upload
- **Tabelas**: `documents`

### 5. Módulo de Agendamento
- **Funcionalidades**:
  - Gerenciamento de horários disponíveis
  - Solicitação de agendamentos via página pública
  - Confirmação ou cancelamento de agendamentos
- **Tecnologias**: React Calendar, React Query
- **Tabelas**: `appointments`, `appointment_slots`

### 6. Módulo de Relatórios e Extras
- **Funcionalidades**:
  - Dashboard com estatísticas
  - Exportação de dados em CSV
  - Galeria de pets em cards
  - Listagem de animais perdidos
- **Tecnologias**: Chart.js, React CSV
- **Tabelas**: Utiliza dados de várias tabelas

## Arquitetura do Banco de Dados

### Principais Tabelas

1. **clinics**
   - id (PK)
   - name
   - email
   - password_hash
   - phone
   - address
   - logo
   - created_at
   - updated_at

2. **users**
   - id (PK)
   - clinic_id (FK)
   - name
   - email
   - password_hash
   - role
   - created_at
   - updated_at

3. **pets**
   - id (PK)
   - clinic_id (FK)
   - name
   - species
   - breed
   - gender
   - age
   - color
   - owner_name
   - owner_phone
   - photo
   - observations
   - lost_status
   - created_at
   - updated_at

4. **documents**
   - id (PK)
   - pet_id (FK)
   - name
   - file_path
   - file_type
   - uploaded_at
   - created_at
   - updated_at

5. **appointments**
   - id (PK)
   - pet_id (FK)
   - clinic_id (FK)
   - date_time
   - pet_name
   - owner_name
   - owner_phone
   - status
   - notes
   - created_at
   - updated_at

## Fluxos de Integração

### Fluxo de Cadastro e Geração de QR Code
1. Clínica faz login no sistema
2. Acessa o módulo de cadastro de animais
3. Preenche os dados do animal e do tutor
4. Faz upload da foto do animal
5. Salva o registro no banco de dados
6. Sistema gera automaticamente um QR Code
7. QR Code é exibido e pode ser impresso ou adicionado à carteirinha

### Fluxo de Acesso via QR Code
1. Usuário escaneia o QR Code do animal
2. É direcionado para a página pública do animal
3. Visualiza informações do animal, tutor e clínica
4. Pode solicitar agendamento ou contatar o tutor (se animal perdido)

### Fluxo de Upload de Documentos
1. Clínica acessa o perfil do animal
2. Seleciona a opção de gerenciamento de documentos
3. Faz upload de novos documentos
4. Sistema armazena os documentos e os associa ao animal
5. Documentos ficam disponíveis para visualização e download

### Fluxo de Agendamento
1. Tutor acessa a página pública do animal via QR Code
2. Solicita agendamento de consulta
3. Clínica recebe notificação de nova solicitação
4. Clínica confirma ou cancela o agendamento
5. Tutor recebe confirmação (opcional: por email)

## Pontos de Extensão

O sistema foi projetado para permitir extensões futuras:

1. **Módulo de Notificações**
   - Notificações por email para tutores
   - Lembretes de consultas
   - Alertas de vacinas

2. **Integração com Serviços Externos**
   - Integração com Google Calendar
   - Integração com sistemas de pagamento
   - Integração com serviços de SMS

3. **Aplicativo Mobile**
   - Versão mobile para tutores
   - Notificações push
   - Acesso offline a informações básicas

4. **Módulo de Telemedicina**
   - Consultas virtuais
   - Chat entre clínica e tutor
   - Compartilhamento seguro de documentos

Esta estrutura modular garante que o sistema seja escalável, manutenível e possa evoluir com novas funcionalidades no futuro.
