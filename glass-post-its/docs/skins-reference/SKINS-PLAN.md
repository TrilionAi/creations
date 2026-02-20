# Glass Post-Its - Sistema de Skins 3D Realistas

## Visao Geral

Cada skin transforma a janela do post-it em um objeto 3D fotorrealista (cubo de gelo, lava, madeira, etc.) onde o conteudo editavel aparece "dentro" do objeto. O efeito e alcancado com **camadas de imagens PNG sobrepostas** + efeitos CSS.

## Imagens de Referencia (nesta pasta)

| Arquivo | Conceito |
|---------|----------|
| `cubo-de-gelo-com-algo-dentro.jpeg` | **MELHOR REFERENCIA** - Rosto dentro de gelo hiper-realista. O conteudo do post-it ficaria no lugar do rosto. |
| `Gemini_Generated_Image_*.png` | Cubo de gelo com post-it amarelo dentro. Mostra o conceito exato (bilhete visivel atraves do gelo). |
| `cubo-de-lava.jpeg` | Cubo de rocha vulcanica com rachaduras incandescentes. Conteudo brilharia pelas fissuras. |
| `cubo-de-madeira.jpeg` | Cubo de madeira macica. Conteudo na face frontal. |
| `uma-laranja.jpeg` | Formato esferico. Conteudo na superficie da casca. |
| `imagem-do-sol-super-realista.jpeg` | Eclipse/corona solar. Conteudo no centro escuro com brilho ao redor. |

---

## Arquitetura de Camadas

Cada skin e composta por **4 camadas** empilhadas via CSS (`position: absolute` + `z-index`):

```
Camada 4 (z-index: 10)  OVERLAY FRONTAL
  PNG semi-transparente. A "superficie" do objeto que fica
  POR CIMA do conteudo editavel, dando o efeito de "dentro".
  Ex: a face frontal translucida do gelo.
  pointer-events: none (nao bloqueia cliques no conteudo)

Camada 3 (z-index: 5)   CONTEUDO EDITAVEL
  A area do editor TipTap com o texto, checklists, etc.
  Centralizado dentro do "objeto". Pode ter CSS de tint/blur
  para integrar com o tema da skin.

Camada 2 (z-index: 2)   FRAME / BORDAS
  PNG das bordas 3D do objeto. Cria a moldura ao redor do
  conteudo. Ex: as arestas do cubo de gelo, as laterais
  da madeira.

Camada 1 (z-index: 1)   BACKGROUND
  PNG do fundo do objeto. A "parede de tras" do cubo.
  Pode ser uma textura ou uma imagem mais escura.

Camada 0 (z-index: 0)   SOMBRA / REFLEXO
  PNG da sombra projetada e/ou reflexo na superficie.
  Fica FORA da area principal (embaixo e ao redor).
```

### Diagrama visual da composicao:

```
 ___________________________________
|          SOMBRA (camada 0)        |
|   _____________________________   |
|  |      BACKGROUND (camada 1)  |  |
|  |   _______________________   |  |
|  |  |    FRAME (camada 2)   |  |  |
|  |  |   _________________   |  |  |
|  |  |  |               |X|  |  |  |   X = Titlebar (pin, close)
|  |  |  |   CONTEUDO    |  |  |  |
|  |  |  |   EDITAVEL    |  |  |  |
|  |  |  |   (camada 3)  |  |  |  |
|  |  |  |_______________|  |  |  |
|  |  |   OVERLAY (camada 4)|  |  |   <-- semi-transparente, sobre o conteudo
|  |  |_____________________|  |  |
|  |_____________________________|  |
|___________________________________|
```

---

## Specs Tecnicas dos Assets PNG

### Resolucao e formato

- **Formato**: PNG-32 (com canal alfa/transparencia)
- **Resolucao base**: 640x760 pixels (proporcao da janela padrao 320x380 @2x)
- **DPI**: 144 (retina/HiDPI)
- **Alternativa**: Gerar em 1280x1520 e deixar o CSS reduzir (melhor qualidade)
- **Cor de fundo**: Transparente (checkerboard no Photoshop)

### Margem de seguranca para sombra

As imagens de sombra/reflexo precisam de espaco extra ao redor:
- Adicionar **40px** de margem em cada lado para a sombra nao ser cortada
- Resolucao da sombra: 720x840 (640+80 x 760+80)

### Area de conteudo (content safe zone)

O conteudo editavel precisa de uma area "segura" onde o texto fica legivel:
- **Margem interna**: pelo menos 30px de cada lado dentro do frame
- **Area util**: ~580x640 na resolucao @2x

---

## Detalhes por Skin

### 1. ICE CUBE (Cubo de Gelo)

**Conceito**: Post-it congelado dentro de um bloco de gelo translucido. O texto aparece distorcido e azulado como se estivesse preso no gelo.

#### Camadas necessarias:

**ice-shadow.png** (Camada 0)
- Sombra suave embaixo do cubo + reflexo no "chao"
- Pouca de agua derretida ao redor (detalhe realista)

**ice-background.png** (Camada 1)
- Interior do gelo visto por tras
- Textura de gelo com bolhas de ar, rachaduras internas
- Levemente azulado, semi-transparente

**ice-frame.png** (Camada 2)
- As arestas do cubo de gelo (bordas 3D)
- Perspectiva isometrica levemente inclinada
- Reflexos de luz nas arestas
- Centro completamente transparente (buraco para o conteudo)

**ice-overlay.png** (Camada 4)
- A face frontal do gelo
- **MUITO transparente** (opacity ~15-25%) para o texto ser legivel
- Textura de gelo com reflexos, riscos, bolhas
- Simula o efeito de "ver atraves do gelo"

#### Prompts Midjourney:

```
ice-shadow:
"realistic ice cube shadow and water reflection on dark surface,
top-down view, melting water drops around, dark background,
product photography lighting --ar 16:19 --v 6"

ice-background:
"inside of an ice cube seen from behind, frozen air bubbles,
ice cracks, blue-white translucent, studio lighting,
transparent PNG background --ar 16:19 --v 6"

ice-frame:
"3D ice cube frame border only, edges and corners visible,
center is completely empty/transparent, isometric view slightly
from above, photorealistic ice with light reflections on edges,
black background --ar 16:19 --v 6"

ice-overlay:
"flat ice surface texture, top view, very subtle, scratches
and bubbles in ice, light reflections, highly transparent,
barely visible ice texture, seamless --ar 16:19 --v 6"
```

#### Efeitos CSS:
```css
.skin-ice .content-area {
  color: rgba(200, 220, 255, 0.9);        /* texto azulado */
  text-shadow: 0 0 4px rgba(150, 200, 255, 0.3);
  filter: blur(0.3px);                     /* leve desfoque "congelado" */
}
.skin-ice .overlay {
  opacity: 0.2;
  mix-blend-mode: screen;
}
.skin-ice .frame {
  filter: drop-shadow(0 0 8px rgba(150, 200, 255, 0.2));
}
```

---

### 2. LAVA CUBE (Cubo de Lava/Magma)

**Conceito**: Cubo de rocha vulcanica com rachaduras incandescentes. O texto do post-it brilha como se fosse magma visto pelas fissuras.

#### Camadas necessarias:

**lava-shadow.png** (Camada 0)
- Reflexo alaranjado no chao embaixo do cubo
- Brilho difuso de lava

**lava-background.png** (Camada 1)
- Textura de rocha escura (basalto)
- Sem rachaduras (fundo solido escuro)

**lava-frame.png** (Camada 2)
- Bordas do cubo de rocha com rachaduras brilhantes
- Arestas irregulares (rocha fragmentada)
- Lava/magma visivel nas fissuras das bordas
- Centro transparente

**lava-overlay.png** (Camada 4)
- Rachaduras de lava sobre o conteudo
- As rachaduras devem ser finas para nao cobrir muito texto
- Brilho alaranjado nas rachaduras
- Fundo transparente, so as rachaduras visíveis

#### Prompts Midjourney:

```
lava-shadow:
"orange magma glow reflection on dark stone floor,
volcanic light from above, dramatic lighting,
dark background --ar 16:19 --v 6"

lava-background:
"dark basalt rock texture, rough volcanic stone surface,
very dark gray almost black, no cracks, flat surface,
studio lighting --ar 16:19 --v 6"

lava-frame:
"3D volcanic rock cube frame, edges with glowing lava cracks,
magma visible in fissures, center completely empty/transparent,
isometric view, photorealistic, black background --ar 16:19 --v 6"

lava-overlay:
"thin glowing lava cracks pattern, magma veins on transparent
background, orange-red glow, sparse thin cracks not too dense,
top view flat, seamless texture --ar 16:19 --v 6"
```

#### Efeitos CSS:
```css
.skin-lava .content-area {
  color: rgba(255, 200, 150, 0.95);
  text-shadow: 0 0 6px rgba(255, 100, 0, 0.4),
               0 0 20px rgba(255, 50, 0, 0.15);
}
.skin-lava .overlay {
  opacity: 0.35;
  mix-blend-mode: screen;
  animation: lava-pulse 4s ease-in-out infinite alternate;
}
@keyframes lava-pulse {
  from { opacity: 0.3; }
  to { opacity: 0.4; }
}
.skin-lava .frame {
  filter: drop-shadow(0 0 12px rgba(255, 80, 0, 0.3));
}
```

---

### 3. WOOD CUBE (Cubo de Madeira)

**Conceito**: Cubo de madeira nobre com o conteudo "entalhado" ou visivel na face frontal, como uma placa de madeira.

#### Camadas necessarias:

**wood-shadow.png** (Camada 0)
- Sombra suave e quente no chao

**wood-background.png** (Camada 1)
- Textura de madeira (fundo da face frontal)
- Grao da madeira visivel, tons quentes

**wood-frame.png** (Camada 2)
- Moldura 3D de madeira (lateral, topo, bordas)
- Perspectiva isometrica
- Grao da madeira nas laterais visíveis
- Centro transparente

**wood-overlay.png** (Camada 4)
- **Opcional/muito sutil**: Leve textura de verniz ou grao
- Quase invisivel (opacity 5-10%)
- Pode ser omitido se a madeira ja ficar bonita sem

#### Prompts Midjourney:

```
wood-frame:
"3D solid wood cube frame, walnut wood grain visible on sides,
center face is completely empty/transparent, isometric view
slightly from above, warm studio lighting, photorealistic,
black background --ar 16:19 --v 6"

wood-background:
"polished walnut wood surface texture, visible grain pattern,
warm brown tones, flat top view, high detail,
studio lighting --ar 16:19 --v 6"

wood-shadow:
"soft warm shadow of a cube on light surface,
subtle, product photography --ar 16:19 --v 6"
```

#### Efeitos CSS:
```css
.skin-wood .content-area {
  color: rgba(60, 40, 20, 0.9);           /* texto escuro sobre madeira */
  text-shadow: 0 1px 0 rgba(255, 200, 150, 0.2);
}
.skin-wood .titlebar { color: rgba(60, 40, 20, 0.7); }
```

---

### 4. ORANGE (Laranja)

**Conceito**: O post-it aparece na superficie de uma laranja realista. Formato mais arredondado.

#### Camadas necessarias:

**orange-shadow.png** (Camada 0)
- Sombra arredondada

**orange-background.png** (Camada 1)
- Textura de casca de laranja (poros visiveis)
- Tom alaranjado vibrante

**orange-frame.png** (Camada 2)
- Bordas da laranja (curvatura 3D)
- Folha no topo como detalhe
- Centro transparente
- Usar `border-radius: 50%` no CSS da janela ou `clip-path: ellipse()`

**orange-overlay.png** (Camada 4)
- Leve textura de casca por cima (poros sutis)
- Muito transparente

#### Prompts Midjourney:

```
orange-frame:
"realistic orange fruit, front view, center area removed/transparent
showing empty space, only the curved edges visible, green leaf on top,
photorealistic, black background --ar 1:1 --v 6"

orange-background:
"orange peel texture close up, vibrant orange color, visible pores,
flat surface, studio macro photography --ar 1:1 --v 6"
```

#### Especial - Janela:
- Proporção 1:1 (quadrada tendendo a circular)
- `clip-path: ellipse(48% 48%)` no CSS para formato arredondado
- Tamanho: 380x380

---

### 5. SUN (Sol / Eclipse Solar)

**Conceito**: O conteudo aparece no centro escuro de um eclipse solar, rodeado pela corona brilhante.

#### Camadas necessarias:

**sun-shadow.png** (Camada 0)
- Brilho radiante ao redor (glow)

**sun-background.png** (Camada 1)
- Centro escuro (superficie solar escura / disco lunar)

**sun-frame.png** (Camada 2)
- A corona solar ao redor (raios de luz)
- Centro transparente

**sun-overlay.png** (Camada 4)
- Labaredas solares sutis sobre o conteudo
- Muito transparente

#### Prompts Midjourney:

```
sun-frame:
"solar eclipse corona, ring of fire around empty transparent center,
solar flares and prominences, photorealistic NASA-style,
black background --ar 1:1 --v 6"

sun-background:
"dark solar surface texture, subtle orange glow patches,
sunspots, very dark, space photography style --ar 1:1 --v 6"
```

#### Efeitos CSS:
```css
.skin-sun .content-area {
  color: rgba(255, 200, 120, 0.95);
  text-shadow: 0 0 8px rgba(255, 150, 0, 0.3);
}
.skin-sun .frame {
  filter: drop-shadow(0 0 20px rgba(255, 150, 0, 0.4));
  animation: sun-glow 3s ease-in-out infinite alternate;
}
@keyframes sun-glow {
  from { filter: drop-shadow(0 0 20px rgba(255, 150, 0, 0.3)); }
  to { filter: drop-shadow(0 0 30px rgba(255, 150, 0, 0.5)); }
}
```

---

## Implementacao no Codigo

### Estrutura de arquivos

```
glass-post-its/
  src/
    assets/
      skins/
        ice/
          ice-shadow.png
          ice-background.png
          ice-frame.png
          ice-overlay.png
          config.json
        lava/
          lava-shadow.png
          lava-background.png
          lava-frame.png
          lava-overlay.png
          config.json
        wood/
          ...
        orange/
          ...
        sun/
          ...
    lib/
      skins.ts          <-- definicao de cada skin (paths, configs, efeitos)
    components/
      SkinRenderer.tsx   <-- componente que monta as camadas
```

### config.json de cada skin

```json
{
  "name": "Ice Cube",
  "id": "ice",
  "windowSize": { "width": 320, "height": 380 },
  "windowShape": "rectangle",
  "contentPadding": { "top": 50, "right": 25, "bottom": 25, "left": 25 },
  "overlayOpacity": 0.2,
  "overlayBlendMode": "screen",
  "contentCSS": {
    "color": "rgba(200, 220, 255, 0.9)",
    "textShadow": "0 0 4px rgba(150, 200, 255, 0.3)",
    "filter": "blur(0.3px)"
  },
  "layers": {
    "shadow": "ice-shadow.png",
    "background": "ice-background.png",
    "frame": "ice-frame.png",
    "overlay": "ice-overlay.png"
  }
}
```

### SkinRenderer.tsx (componente principal)

```tsx
interface SkinRendererProps {
  skin: SkinConfig;
  children: React.ReactNode;  // o editor TipTap
}

function SkinRenderer({ skin, children }: SkinRendererProps) {
  return (
    <div className={`skin-container skin-${skin.id}`}>
      {/* Camada 0: Sombra */}
      <img className="skin-shadow" src={skin.layers.shadow} />

      {/* Camada 1: Background */}
      <img className="skin-background" src={skin.layers.background} />

      {/* Camada 2: Frame/Bordas */}
      <img className="skin-frame" src={skin.layers.frame} />

      {/* Camada 3: Conteudo editavel */}
      <div className="skin-content" style={skin.contentCSS}>
        {children}
      </div>

      {/* Camada 4: Overlay frontal */}
      <img
        className="skin-overlay"
        src={skin.layers.overlay}
        style={{
          opacity: skin.overlayOpacity,
          mixBlendMode: skin.overlayBlendMode,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
```

### CSS base das camadas

```css
.skin-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;  /* permite sombra sair */
}

.skin-shadow,
.skin-background,
.skin-frame,
.skin-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}

.skin-shadow   { z-index: 0; }
.skin-background { z-index: 1; }
.skin-frame    { z-index: 2; }
.skin-overlay  { z-index: 10; pointer-events: none; }

.skin-content {
  position: relative;
  z-index: 5;
  /* padding definido pelo config.json de cada skin */
  overflow-y: auto;
  height: 100%;
}
```

---

## Workflow para Criar uma Nova Skin

### Passo 1: Gerar os assets no Midjourney

1. Usar os prompts listados acima para cada skin
2. Escolher a melhor variacao (upscale)
3. Baixar em alta resolucao

### Passo 2: Processar no Photoshop/GIMP

1. **Remover fundo** de todas as imagens (deixar transparente)
2. **Separar as camadas**:
   - Recortar o centro do frame (deixar buraco transparente para o conteudo)
   - Isolar a sombra
   - Criar o overlay (pegar a textura frontal e reduzir drasticamente a opacidade)
3. **Padronizar resolucao**: Todas em 640x760 (ou 1280x1520 @2x)
4. **Salvar como PNG-32** com transparencia

### Passo 3: Testar composicao

1. Empilhar as camadas no Photoshop para validar o visual
2. Colocar um texto de exemplo na camada de conteudo
3. Ajustar opacidades e posicoes ate ficar bom

### Passo 4: Integrar no codigo

1. Colocar os PNGs em `src/assets/skins/{nome}/`
2. Criar o `config.json` da skin
3. Registrar no `skins.ts`
4. Testar no app

---

## Dicas para o Midjourney

### Conseguir transparencia (centro vazio)

O Midjourney nao gera PNGs transparentes nativamente. Estrategias:

1. **Fundo preto** (`--style raw`, "black background"): Depois remover o preto no Photoshop
2. **Fundo branco** para sombras: Inverter e usar como mascara
3. **Descrever "empty center"**: Pedir explicitamente que o centro seja vazio/transparente
4. **Pos-processamento**: Sempre sera necessario no Photoshop para limpar as camadas

### Consistencia de angulo

Todas as skins devem usar o **mesmo angulo de camera**:
- Isometrico, levemente de cima (10-15 graus)
- Iluminacao vindo da esquerda-superior
- Usar `--sref` (style reference) com a primeira imagem aprovada para manter consistencia

### Parametros uteis

```
--ar 16:19      (proporcao da janela do post-it)
--v 6           (versao mais recente)
--style raw     (mais fotografico, menos artistico)
--s 100         (stylize baixo = mais literal)
--q 2           (qualidade maxima)
--no text, letters, words   (evitar texto gerado pela AI)
```

---

## Consideracoes Especiais

### Performance
- PNGs grandes podem impactar memoria. Manter abaixo de 500KB por camada.
- Usar compressao PNG otimizada (pngquant, optipng).
- Considerar converter para WebP para melhor compressao.

### Tauri Window
- A janela ja e transparente (`transparent: true`) e sem decoracoes.
- Para skins com formato nao-retangular (laranja, sol), usar `clip-path` no CSS.
- A area de arrasto (drag) da titlebar precisa se adaptar a cada skin.

### Fallback
- Manter a skin "glass" atual como default/fallback.
- Se algum PNG nao carregar, mostrar a skin glass.

### Skin Picker
- Redesenhar o SkinPicker para mostrar preview de cada skin 3D.
- Pode ser um carrossel ou grid com miniaturas.
