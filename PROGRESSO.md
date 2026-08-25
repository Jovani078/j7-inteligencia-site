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

## Máquina de escrever (typewriter) em parágrafos-chave

**Solução comprovada**: `attachTypewriter()` em `src/lib/typewriter.ts` —
divide o texto em caracteres via `SplitText` (`type:"chars"`), revela cada
um (`opacity`) proporcionalmente a `self.progress` dentro de um
`ScrollTrigger` com `scrub:true`. Reversível "de graça": como é só leitura
de progresso a cada tick (não um tween de disparo único), rolar pra cima
desfaz a revelação automaticamente, sem lógica extra.

Cursor piscando (`.typewriter-cursor` no CSS) acompanha a posição real do
último caractere revelado via `getBoundingClientRect()`, recalculada a cada
tick — funciona certo mesmo com quebra de linha. Fica `display:none` por
padrão (só vira visível via classe `.is-active`, adicionada pelo JS) — assim
`prefers-reduced-motion` nunca mostra um cursor "preso" ali, já que o setup
inteiro é pulado nesse caso.

Markup de referência (repetido em cada parágrafo que usa o efeito):
```jsx
<div ref={wrapRef} className="relative">
  <p ref={textRef}>...texto...</p>
  <span ref={cursorRef} className="typewriter-cursor" aria-hidden="true" />
</div>
```
Pra ritmo mais pausado num parágrafo específico (ex: o de urgência antes de
um CTA), passa uma janela de scrub mais larga: `attachTypewriter(wrap, text,
cursor, { start: "top 85%", end: "bottom 35%" })` em vez dos valores padrão
(`top 80%` / `bottom 55%`).

## Investigação recorrente: "duplicação" da seção 002/O problema (Rupture.tsx)

Relatada 3 vezes até agora (mais recente: Passo 13). **Nunca reproduzida
tecnicamente**, apesar de investigação extensa a cada vez. Registro aqui pra
não repetir o trabalho sem saber o que já foi descartado:

- `git log -- src/components/sections/Rupture.tsx` mostra o arquivo tocado
  em **um único commit** (o checkpoint inicial do `git init` desta sessão).
  Nenhuma mudança de código depois disso — ou seja, não é regressão de
  nenhum passo recente (004/O sistema, limpeza de hover, etc. nunca
  encostaram nesse arquivo).
- O arquivo de fato tem DOIS blocos — um `hidden md:block` (diagrama
  desktop) e um `md:hidden` (lista vertical mobile) — só um visível por
  vez, é o padrão responsivo intencional do site, não um bug.
- Testado tecnicamente 3 vezes, a última bem exaustiva: 18 larguras de tela
  diferentes (320px–1920px) × 3 motores de navegador (Chromium, Firefox,
  WebKit) direto no link ao vivo que o usuário estava testando. Em nenhuma
  combinação os dois blocos apareceram simultaneamente visíveis.
- Se isso for relatado de novo: pedir print/vídeo da tela real (já pedido
  2x, ainda não recebido) antes de investigar de novo — sem isso não tem
  como saber se é o mesmo link atualizado, cache de navegador, ou algo
  genuinamente não coberto pelos testes acima.

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
  não são elementos separados — ver limitação acima), parágrafo de intro
  (máquina de escrever), 7 cards de funcionalidade (entrada + hover),
  mockup mobile (giro 360° + hover separado), tela de login (entrada +
  hover), parágrafo de urgência antes do CTA (máquina de escrever, ritmo
  mais pausado)
- Counters.tsx — pin desktop + contagem sincronizada ao scroll
- Hero.tsx — headline com reveal por palavra, vídeo de fundo full-bleed
- ChatDemo.tsx — indicador de "digitando" + revelação sequencial de mensagens
