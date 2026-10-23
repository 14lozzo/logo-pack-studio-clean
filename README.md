# Logo Pack Studio — Foundation v1.0

Nova base independente para GitHub Pages. Não utiliza os ficheiros `legacy-engine.js`, `app-v15.js`, nem a pasta `reference` das versões anteriores.

## Instalação

1. Cria um **novo repositório** GitHub (ex.: `logo-pack-studio-foundation`). Não apagues o repositório antigo.
2. Coloca `index.html`, `style.css`, `app.js`, a pasta `vendor/` e a pasta `mockups/` na **raiz** do novo repositório.
3. Em Settings > Pages, escolhe **Deploy from a branch** > `main` > `/(root)`.
4. Abre o URL publicado e testa com um SVG original, um símbolo e as fontes da marca.

## Módulos

- Identidade: nome, conceito, personalidade, logótipo e símbolo SVG/PNG, área de proteção, dimensões mínimas.
- Sistema visual: paleta principal/secundária/apoios, ângulo dourado, análogas, triádicas e complementares; uploads H1/H2/H3; Pattern Studio.
- Aplicações: upload de fotografias reais e pré-visualizações 2D de cartão, post, story, cartaz e outdoor. Os mockups 2D são **simulações gráficas**, não fotografias reais.
- Biblioteca GitHub: permite listar imagens através de manifesto JSON remoto (`mockups/manifest.example.json`), para abrir e descarregar; para as colocar no PDF, faz upload das imagens nos campos correspondentes.
- Brand Guidelines: 20 páginas A4 fixas, mesmo canvas usado no preview e na exportação.
- Exportação: PDF, Brand Board PNG, paleta SVG e ZIP com variantes PNG/JPG/SVG, favicons PNG/SVG/ICO, patterns, imagens de aplicação, referências de fontes e JSON do projeto.

## Exportação e limitações

- O PDF usa páginas rasterizadas em JPEG de alta qualidade para **igualdade visual com a pré-visualização**. O texto no PDF não é selecionável e não é vetorial. As variantes SVG, quando a origem é SVG, preservam a imagem vetorial original embutida; quando a origem é PNG, o SVG é um contentor de imagem raster e não cria vetores novos.
- Os códigos CMYK são **aproximações matemáticas**, não conversões com perfil ICC.
- Os JPEG usam fundo sólido porque JPEG não suporta transparência.
- As fontes carregadas são utilizadas na pré-visualização e no PDF quando o navegador consegue carregá-las. **Não são redistribuídas** no ZIP por razões de licenciamento.
- O navegador processa os dados localmente. Projetos JSON podem conter imagens e fontes codificadas e ficar grandes; guarda-os em local seguro.
- As áreas de proteção e dimensões mínimas são regras configuráveis pelo designer, não inferidas automaticamente do SVG.
- Para mockups fotográficos reais, é necessário carregar uma imagem real do projeto; a biblioteca GitHub é apenas uma fonte opcional de imagens externas.

## Verificação efetuada

Foi realizado um teste automatizado num navegador Chromium com logótipo e símbolo SVG de teste: a aplicação abriu sem exceções JavaScript; foram gerados um PDF de 20 páginas A4 e um ZIP contendo variantes, favicons, paleta SVG e PDF. As 20 páginas do PDF foram renderizadas e inspecionadas num mosaico visual. **Isto não equivale à validação com os SVG reais da RŌGUE. nem com todas as fontes/mockups possíveis.**

## Estrutura do código

- `index.html` — cinco etapas e pré-visualização.
- `style.css` — interface.
- `app.js` — estado, composição editorial, variantes, exportação PDF e ZIP.
- `vendor/jszip.min.js` — biblioteca ZIP incluída localmente (terceiros).
- `mockups/manifest.example.json` — formato do manifesto de biblioteca.
