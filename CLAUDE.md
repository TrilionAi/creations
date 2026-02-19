# Creations - Convenções de Trabalho

## Estrutura do Repositório

Repositório: `https://github.com/TrilionAi/creations.git`

Cada criação vive em sua **pasta isolada** na raiz do repo:

```
creations/
├── CLAUDE.md              ← Este arquivo (convenções globais)
├── .github/workflows/     ← GitHub Actions (builds de todas as criações)
├── glass-post-its/        ← Criação 1
├── proxima-criacao/       ← Criação 2
└── outra-criacao/         ← Criação 3
```

Regras:
- **Uma pasta por criação** — nunca misturar projetos
- Cada pasta é autônoma com suas próprias dependências e configurações
- Sem dependências cruzadas entre criações
- Cada criação define sua própria stack (pode ser qualquer tecnologia)

## Ambiente de Desenvolvimento

- **Código é escrito no VPS** (Linux, sem display gráfico)
- **Testes são feitos no PC pessoal** (Windows 11) baixando os releases do GitHub
- O VPS não roda apps gráficos — todo teste visual é via release

## Git Workflow

### Branches
- `main` — branch principal, sempre funcional
- Commits direto na main (workflow simplificado)

### Releases e Builds
- **GitHub Actions** compila automaticamente quando uma tag é criada
- Cada criação tem seu workflow em `.github/workflows/`
- Releases ficam em: https://github.com/TrilionAi/creations/releases
- O que o build gera depende da criação (pode ser .exe, .dmg, .apk, site, etc.)

### Fluxo para publicar nova versão:
```bash
git add -A
git commit -m "feat: descrição da mudança"
git push
git tag v0.X.0
git push origin v0.X.0
```

### Convenção de tags:
- Projeto único: `v{major}.{minor}.{patch}` (ex: v0.1.0)
- Múltiplos projetos: `{nome}-v{major}.{minor}.{patch}` (ex: `glass-post-its-v0.1.0`)

## Regras para Instaladores Desktop

Quando a criação gera um app instalável:
- **Desinstalação limpa (hard delete)** — sempre configurar para apagar dados locais do usuário ao desinstalar
- O usuário não deve ter que caçar pastas manualmente para limpar

## Checklist para Nova Criação

1. [ ] Criar pasta isolada: `creations/{nome-da-criacao}/`
2. [ ] Escolher stack e scaffoldar o projeto
3. [ ] Criar workflow em `.github/workflows/{nome}-build.yml`
4. [ ] Implementar
5. [ ] Verificar que compila sem erros
6. [ ] Commit + push + tag para gerar release
7. [ ] Baixar no PC e testar
