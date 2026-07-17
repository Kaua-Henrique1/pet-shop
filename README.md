# pet-shop

# 🐾 PetShopManager - Backend (.NET Core API)

Este é o guia rápido de como configurar, compilar e executar o servidor de desenvolvimento do ecossistema **PetShopManager**.

---

## 🛠️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **.NET SDK 8.0** ou superior (verifique com `dotnet --version`)
- **MySQL Server 8.0** ativo (Utilizando a imagem Docker `mysql:8.0` ou instalação local)

---

## 🚀 Passo a Passo para Rodar o Projeto

Siga as etapas abaixo a partir do seu terminal (na pasta raiz do projeto backend, onde se encontra o arquivo `backend.csproj` ou `Program.cs`):

### 1. Restaurar as Dependências
Baixe os pacotes NuGet necessários para a execução do backend:
```bash
dotnet restore
```

### 2. Configurar a String de Conexão (Banco de Dados)
Certifique-se de que o arquivo `appsettings.json` (ou `appsettings.Development.json`) possui as credenciais corretas do seu banco de dados MySQL local. Exemplo:
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=PetShopDb;Uid=root;Pwd=SuaSenhaSuperSegura123!;"
}
```

### 3. Executar as Migrations (Se necessário)
Caso esteja rodando pela primeira vez ou tenha alterado alguma tabela, aplique as migrações para criar as tabelas no MySQL:
```bash
dotnet ef database update
```

### 4. Compilar e Iniciar o Servidor
Execute o comando abaixo para compilar o código C# e iniciar a API em modo de desenvolvimento com monitoramento automático de arquivos (*hot reload*):
```bash
dotnet watch run
```
*Ou, se preferir apenas rodar sem o watch:*
```bash
dotnet run
```

---

## 🧭 Acessando a Documentação (Swagger)

Uma vez que o terminal exibir o log informando que a aplicação está de pé, a documentação oficial, interativa e protegida por Token JWT estará disponível no seu navegador.

Acesse o endereço exibido no seu console (ajustando a porta se necessário):
👉 **[http://localhost:5036/swagger/index.html](http://localhost:5036/swagger/index.html)**

### 🔐 Como Testar Rotas Protegidas no Navegador:
1. Vá até o bloco `AuthController`, clique em **Try it out** na rota de `/api/auth/login`.
2. Insira as credenciais de um usuário válido e clique em **Execute**.
3. Copia o token JWT retornado (apenas o texto de dentro das aspas).
4. Role a página do Swagger até o topo e clique no botão **Authorize** (ícone de cadeado).
5. Digite exatamente `Bearer ` (com o espaço depois) e cole o seu token. Clique em Authorize.
6. Pronto! Agora todas as rotas de Tutores e Animais estarão desbloqueadas para teste direto na interface.
