# Ícones para o PWA

Este diretório contém o ícone SVG principal do aplicativo. Para gerar os ícones PNG em diferentes tamanhos necessários para o PWA, você pode usar uma das seguintes abordagens:

## Opção 1: Usando a linha de comando com Inkscape

Se você tem o Inkscape instalado, pode usar o seguinte comando:

```bash
# Para cada tamanho necessário
inkscape -w 72 -h 72 icon.svg -o icon-72x72.png
inkscape -w 96 -h 96 icon.svg -o icon-96x96.png
inkscape -w 128 -h 128 icon.svg -o icon-128x128.png
inkscape -w 144 -h 144 icon.svg -o icon-144x144.png
inkscape -w 152 -h 152 icon.svg -o icon-152x152.png
inkscape -w 192 -h 192 icon.svg -o icon-192x192.png
inkscape -w 384 -h 384 icon.svg -o icon-384x384.png
inkscape -w 512 -h 512 icon.svg -o icon-512x512.png
```

## Opção 2: Usando um serviço online

Você pode usar serviços online como:

1. [RealFaviconGenerator](https://realfavicongenerator.net/)
2. [AppIcon](https://www.appicon.co/)
3. [PWABuilder](https://www.pwabuilder.com/)

Carregue o ícone SVG e baixe os ícones gerados em diferentes tamanhos.

## Opção 3: Usando um editor de imagem

Abra o arquivo SVG em um editor de imagem como Adobe Illustrator, Figma, ou Photoshop e exporte em diferentes tamanhos.

---

Lembre-se que os ícones são referenciados no arquivo `manifest.json` na raiz da pasta pública. 