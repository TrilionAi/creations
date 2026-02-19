# Creations - Workspace Conventions

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
- Cada pasta é autônoma (tem seu próprio package.json, Cargo.toml, etc.)
- Sem dependências cruzadas entre criações

## Ambiente de Desenvolvimento

- **Código é escrito no VPS** (Linux, sem display gráfico)
- **Testes são feitos no PC pessoal** (Windows 11) baixando os releases do GitHub
- O VPS não roda apps gráficos — todo teste visual é via release

## Git Workflow

### Branches
- `main` — branch principal, sempre funcional
- Commits direto na main (workflow simplificado)

### Releases e Builds
- **GitHub Actions** compila automaticamente quando uma tag `v*` é criada
- Cada criação tem seu workflow em `.github/workflows/`
- O build gera instaladores para **Windows (.exe)** e **macOS (.dmg)**
- Releases ficam em: https://github.com/TrilionAi/creations/releases

### Fluxo para publicar nova versão:
```bash
git add -A
git commit -m "feat: descrição da mudança"
git push
git tag v0.X.0
git push origin v0.X.0
```

### Convenção de tags:
- Formato: `v{major}.{minor}.{patch}` (ex: v0.1.0, v0.2.0)
- Para criações com nomes diferentes no futuro: `{nome}-v0.1.0` (ex: `cool-app-v0.1.0`)

## Configuração de Apps (Tauri)

### Desinstalação limpa (Hard Delete)
Todo app Tauri DEVE ter o instalador configurado para **apagar dados do usuário** (AppData) quando desinstalado. Isso é configurado no `tauri.conf.json`:

```json
{
  "bundle": {
    "windows": {
      "nsis": {
        "installerIcon": "icons/icon.ico",
        "uninstallerIcon": "icons/icon.ico"
      }
    }
  }
}
```

E via hook de desinstalação customizado no NSIS ou via script de limpeza.

### Transparência e efeitos visuais
Para apps com efeito glass/transparent:
- `transparent: true` no tauri.conf.json (ou no window builder)
- `decorations: false` para custom title bar
- `window-vibrancy` crate para efeitos nativos
- CSS com `background: transparent` no body

### SQL/Persistência
- Usar `@tauri-apps/plugin-sql` (SQLite) do lado frontend
- Migrations automáticas no código (CREATE TABLE IF NOT EXISTS + ALTER TABLE com try/catch)

## Checklist para Nova Criação

1. [ ] Criar pasta isolada: `creations/{nome-da-criacao}/`
2. [ ] Scaffoldar o projeto (ex: `npm create tauri-app@latest`)
3. [ ] Configurar tauri.conf.json (transparent, decorations, bundle)
4. [ ] Criar workflow em `.github/workflows/{nome}-build.yml`
5. [ ] Implementar o app
6. [ ] Testar TypeScript: `npx tsc --noEmit`
7. [ ] Testar Vite build: `npx vite build`
8. [ ] Testar Cargo: `cargo check` (da pasta src-tauri)
9. [ ] Commit + push + tag para gerar release
10. [ ] Baixar .exe no PC e testar

## Stack Padrão (Tauri Apps)

- **Backend**: Rust + Tauri v2
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: SQLite via tauri-plugin-sql
- **Efeitos**: window-vibrancy (Acrylic/Mica Windows, Vibrancy macOS)
- **Editor Rich Text**: Tiptap (quando necessário)
