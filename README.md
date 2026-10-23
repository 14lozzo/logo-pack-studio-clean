# Logo Pack Studio — Clean Edition

Aplicação nova, sem dependências dos ficheiros V14–V19. Pensada para uso pessoal da RŌGUE. e projetos white-label.

## Instalação no GitHub Pages

1. Cria um **novo repositório** (recomendado: `logo-pack-studio-clean`) para não misturar com a aplicação antiga.
2. Na raiz do repositório coloca **apenas** `index.html`, `style.css` e `app.js`.
3. Em Settings → Pages seleciona Deploy from branch, `main`, `/ (root)`.
4. Aguarda a publicação. Abre o endereço fornecido pelo GitHub Pages.

## Utilização

1. Preenche os campos da identidade e carrega o logótipo/símbolo original em SVG ou PNG.
2. Define as cores e importa as fontes H1, H2 e H3.
3. Gera um pattern a partir do símbolo ou importa um pattern próprio.
4. Carrega fotografias e aplicações reais quando existirem.
5. Abre Brand Guidelines, consulta as 20 páginas, exporta PDF e ZIP.
6. Guarda o projeto em JSON. Para voltar a editá-lo usa Abrir JSON.

## Como funciona o PDF

As páginas A4 são desenhadas pelo mesmo `renderPage()` utilizado na pré-visualização. O PDF usa uma imagem raster por página a 900 × 1273 px, para evitar diferenças de composição. Isto **não é PDF vetorial**; o original SVG é preservado separadamente no ZIP. Os ficheiros TTF/OTF/WOFF carregados são usados na composição gráfica, mas não ficam incorporados como texto selecionável no PDF.

## Requisitos e limitações

- Necessita de Internet para carregar `jsPDF` e `JSZip` por CDN.
- As imagens são processadas no navegador, sem API de IA nem upload para servidor.
- As aplicações fotográficas dependem de ficheiros do utilizador: a app não inventa mockups fotorrealistas.
- A exportação inclui SVG **original** quando foi carregado, variantes PNG/WebP/JPG, ICO/PNG para favicons, PDF, Brand Board e materiais originais. Não converte PNG em SVG vetorial nem gera variantes SVG vetoriais monocromáticas.
- CMYK calculado é aproximado, não substitui gestão de cor profissional.
- PDF A4 fixo com 20 páginas; texto longo é limitado por área. Recomenda-se rever o documento antes de entregar.
- Fontes licenciadas: verificar autorização antes de partilhar os ficheiros no ZIP.
- Testes automáticos de sintaxe e integridade feitos; exportação PDF e interface em navegador real ainda necessitam de validação visual com ficheiros de projeto.

## Segurança

Não coloques ficheiros privados no repositório. Os uploads ficam no navegador e nos ficheiros JSON/ZIP descarregados.
