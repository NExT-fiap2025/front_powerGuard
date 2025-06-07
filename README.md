# ⚡ PowerGuard – Monitoramento de Quedas de Energia

PowerGuard é um aplicativo React Native desenvolvido com Expo para registrar, visualizar e acompanhar **eventos de falta de energia** causados por fenômenos naturais como tempestades, ventos fortes, enchentes e mais.

---
|nome|	rm|
|---|---|
|Gustavo Lopes	|98887|
|Eduardo Gomes	|97919|
|Enzo Cunha	|550985|
## 📱 Funcionalidades

- 📊 **Panorama Geral:** exibe resumo de eventos registrados (totais, resolvidos, duração média, etc.)
- 📍 **Localização Atingida:** pesquisa por bairros, cidades ou CEPs afetados
- ⏱ **Tempo de Interrupção:** análise por categorias (curta, média, longa duração)
- 🧾 **Prejuízos Causados:** exibição de danos reportados (residenciais e públicos)
- 🛟 **Dicas de Segurança:** orientações práticas para antes, durante e após apagões
- 📝 **Cadastro de Evento:** permite ao usuário relatar e registrar novos eventos
- 💾 **Armazenamento Offline:** dados salvos localmente via `AsyncStorage`
- 🎨 **Interface fluida:** animações com `react-native-reanimated` e navegação via tabs

---

## 🛠️ Tecnologias Utilizadas

- **React Native (Expo SDK 53)**
- **TypeScript**
- **Expo Router**
- **AsyncStorage**
- **Lucide React Native (ícones)**
- **react-native-reanimated**
- **uuid**

---

## 📂 Estrutura de Pastas

```

project/
├── app/
│   ├── \_layout.tsx          # Tabs e navegação principal
│   ├── overview\.tsx         # Tela inicial com resumo
│   ├── location.tsx         # Busca por localizações afetadas
│   ├── duration.tsx         # Duração dos eventos
│   ├── damages.tsx          # Prejuízos relatados
│   ├── tips.tsx             # Dicas de segurança
│   ├── add-event.tsx        # Cadastro de novo evento
│   └── +not-found.tsx       # Tela de fallback para rotas inválidas
├── src/
│   ├── components/          # Componentes reutilizáveis (Button, Header, etc.)
│   ├── hooks/               # Hooks customizados (ex: useFrameworkReady)
│   ├── storage/             # AsyncStorage e lógica de persistência
│   └── types/               # Definições de tipos (EventData, EventSummary)
├── assets/images/           # Ícones e imagens do projeto
├── app.json                 # Configurações do Expo
└── tsconfig.json            # Configuração do TypeScript

```

---

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/powerguard-app.git
cd powerguard-app
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o projeto

```bash
npx expo start
```

> Se estiver usando WSL ou Windows, prefira `npx expo start --tunnel`

---

## ✅ Requisitos

* Node.js 18+ (recomendado: 20 ou 22)
* Expo CLI via `npx`
* Android Studio ou dispositivo com Expo Go

---

## 📌 Observações


* Todas as funcionalidades funcionam **offline** (sem necessidade de backend)


```

---

Se quiser, posso gerar esse README como um arquivo `.md` pronto para você colocar no GitHub, ou personalizar com prints, badges ou instruções de deploy na Play Store.

Quer que eu gere o arquivo para download?
```
