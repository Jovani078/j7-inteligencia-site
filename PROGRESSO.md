# Progresso — padrões de animação estabelecidos

Referência rápida dos padrões técnicos já validados nesta LP, pra reaproveitar
em vez de reinventar a cada seção nova.

## Entrada/saída reversível no scroll

- Padrão principal: `ScrollTrigger` com `toggleActions: "play reverse play reverse"`
  (anima de entrada ao descer, de saída ao subir, nos dois sentidos, incluindo
  ao sair pela parte de baixo da seção).
- Variante mais antiga ainda presente em partes do site: `toggleActions: "play none none reverse"`
  (também reversível, mas sem reverter ao "sair" descendo — só ao voltar pra cima).
- Sempre com `prefersReducedMotion()` checado antes: se ativo, aplica o estado
  final direto via `gsap.set()`, sem animação.

## Hover — "vir pra frente" (scale + z-index + sombra/glow)

**Nunca usar CSS puro `:hover`** nos elementos que também recebem animação de
entrada via GSAP. O GSAP deixa um `transform` inline no elemento depois da
entrada (ex: `transform: translate(0px,0px)`), e estilo inline sempre vence
uma regra `:hover` de stylesheet — o `scale()` do hover simplesmente nunca
aplica, mesmo com o CSS "correto". Confirmado no Passo 8.8 inspecionando o
`style` real do elemento antes/depois do hover.

**Solução comprovada**: `attachHoverLift()` em `src/lib/hover-lift.ts` —
aplica o hover via GSAP (`gsap.to(el,{scale:...})`, mesma "linguagem" que já
controla o transform) + escrita direta em `el.style` pra z-index/filter/
border/background. Gated em `(hover: hover) and (pointer: fine)` — nunca
anexa o listener em dispositivo touch, então não existe risco de "hover
grudado" depois de um toque.

Se o elemento estiver dentro de um container com `overflow: hidden` (comum
pra recortar cantos arredondados de uma imagem `fill`), o `scale()` do hover
tem que estar num wrapper OUTRO, sem overflow — senão o crescimento fica
cortado pelo próprio container. Padrão: wrapper externo relative (recebe o
hover) > wrapper interno com `overflow-hidden` + `rounded-*` (recebe a imagem).

## Stagger (cascata) na entrada

`stagger: 0.1` a `0.2` no `gsap.fromTo`, com `ease: "power2.out"` (fade+subida
simples) ou `ease: "back.out(1.5)"` (com leve "pulo"/overshoot, usado nos
cards de foto).

## Limitação conhecida: imagens com conteúdo "batizado" nos pixels

Várias imagens do site (mockups, screenshots) têm texto/elementos visuais
desenhados DENTRO do arquivo de imagem (não são elementos HTML separados).
Não é possível animar/hover partes individuais desses elementos (ex: cada
balão de funcionalidade do mockup do laptop do J7 CRM) sem segmentar a
imagem em assets separados — fora do escopo de edição de código.

## Seções já animadas com esses padrões

- Rupture.tsx (002/O problema) — diagrama desktop + lista mobile
- SolutionCentral.tsx (003/A solução) — stagger + hover nos 3 cards de foto
- CrmProduct.tsx (004/O sistema) — hero do laptop (entrada + hover, balões
  não são elementos separados — ver limitação acima), intro, 7 cards de
  funcionalidade (entrada + hover), mockup mobile (giro 360° + hover
  separado), tela de login (entrada + hover)
- Counters.tsx — pin desktop + contagem sincronizada ao scroll
- Hero.tsx — headline com reveal por palavra, vídeo de fundo full-bleed
- ChatDemo.tsx — indicador de "digitando" + revelação sequencial de mensagens
