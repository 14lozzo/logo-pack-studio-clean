'use strict';
/* Logo Pack Studio Clean — one canvas renderer for preview and PDF. No legacy dependencies. */
const W=900,H=1273,M=66,RIGHT=W-M;
const pageTitles=['Capa','Manifesto','Conceito','Sistema de identidade','Logótipo principal','Versões cromáticas','Símbolo e monograma','Área de proteção','Usos corretos e incorretos','Cores principais','Cores de apoio','Sistema tipográfico','Hierarquia tipográfica','Patterns e elementos','Estacionário','Redes sociais','Campanhas','Direção fotográfica','Brand Board','Créditos'];
const fields=['brandName','tagline','essence','personality','concept','credits','primary','secondary','support1','support2','patternScale','patternGap','patternRotation','patternLayout','safeArea','minPrint','minDigital'];
const S={brandName:'Nova Marca',tagline:'',essence:'',personality:'',concept:'',credits:'',primary:'#CE1738',secondary:'#E9E1D5',support1:'#7B172E',support2:'#D1C4B4',patternScale:'72',patternGap:'28',patternRotation:'0',patternLayout:'stagger',patternMode:'generate',safeArea:'10',minPrint:'25',minDigital:'120',mockupType:'business',mockupManifest:'',assets:{},fonts:{}};
const imgs={},fontFamilies={h1:'Georgia',h2:'Arial',h3:'Arial'};
const $=id=>document.getElementById(id),canvas=$('pageCanvas'),ctx=canvas.getContext('2d');let currentPage=0,renderToken=0;
const escName=()=>filenameSafe(S.brandName||'Marca').replace(/^-|-$/g,'')||'Marca';
function rgb(hex){let h=hex.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)||0)}
function contrast(hex){let [r,g,b]=rgb(hex);return .2126*r+.7152*g+.0722*b<145?'#FFFFFF':'#181818'}
function fill(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function line(c,x,y,xx,yy,col='#ddd',width=1){c.beginPath();c.strokeStyle=col;c.lineWidth=width;c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()}
function txt(c,s,x,y,size=22,color='#222',font='Arial',weight='normal',max=770){c.save();c.font=`${weight} ${size}px ${font}`;c.fillStyle=color;c.textBaseline='alphabetic';let str=String(s||'');if(c.measureText(str).width>max){while(str.length>1&&c.measureText(str+'…').width>max)str=str.slice(0,-1);str+='…'}c.fillText(str,x,y);c.restore()}
function para(c,s,x,y,maxWidth=740,size=24,lineHeight=37,color='#222',font='Arial',maxLines=8){c.save();c.font=`${size}px ${font}`;c.fillStyle=color;c.textBaseline='alphabetic';let words=String(s||'').trim().split(/\s+/),row='',lines=0;for(let word of words){let t=row?row+' '+word:word;if(c.measureText(t).width>maxWidth&&row){c.fillText(row,x,y+lines*lineHeight);lines++;row=word;if(lines>=maxLines)break}else row=t}if(row&&lines<maxLines)c.fillText(row,x,y+lines*lineHeight);c.restore();return Math.min(maxLines,lines+1)}
function placeholder(c,x,y,w,h,label='Material por adicionar'){fill(c,x,y,w,h,'#F1EFEB');line(c,x+20,y+20,x+w-20,y+h-20,'#ddd');txt(c,label,x+26,y+h/2,18,'#8D8881','Arial','normal',w-45)}
function fitImg(c,key,x,y,w,h,pad=0){const im=imgs[key];if(!im){placeholder(c,x,y,w,h,key==='logo'?'Carregar logótipo original':key==='symbol'?'Carregar símbolo':undefined);return false}let scale=Math.min((w-2*pad)/im.naturalWidth,(h-2*pad)/im.naturalHeight);let iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;c.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);return true}
function logo(c,x,y,w,h){return fitImg(c,'logo',x,y,w,h,14)}
function photo(c,key,x,y,w,h){if(!imgs[key]){placeholder(c,x,y,w,h);return}const im=imgs[key],scale=Math.max(w/im.width,h/im.height),iw=im.width*scale,ih=im.height*scale;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);c.restore()}
function panel(c,x,y,w,h,col='#F5F2ED'){fill(c,x,y,w,h,col)}
function label(c,s,x,y){txt(c,String(s).toUpperCase(),x,y,15,S.primary,'Arial','bold')}
function swatch(c,col,x,y,w,h,name){fill(c,x,y,w,h,col);txt(c,name,x,y+h+32,17,'#292929','Arial','bold');txt(c,col.toUpperCase(),x,y+h+57,17,'#555')}
function frame(c,n){fill(c,0,0,W,H,'#FFFFFF');fill(c,0,0,W,9,S.primary);txt(c,'BRAND GUIDELINES',M,45,12,'#181818','Arial','bold');txt(c,S.brandName,RIGHT-180,45,12,'#181818','Arial','bold',180);line(c,M,60,RIGHT,60,'#E8E3DC');txt(c,String(n+1).padStart(2,'0')+' / 20',RIGHT-55,H-44,13,'#8D8781');txt(c,'IDENTIDADE VISUAL  /  '+S.brandName,M,H-44,12,'#8D8781')}
function heading(c,n,kicker){label(c,kicker||'IDENTIDADE VISUAL',M,115);txt(c,pageTitles[n],M,185,48,'#161616',fontFamilies.h1,'normal',765);line(c,M,215,RIGHT,215,'#D9D4CE')}
function caption(c,s,y){txt(c,s,M,y,18,'#69645E',fontFamilies.h3)}
function variantCanvas(key,mode,bg){const a=document.createElement('canvas');a.width=800;a.height=340;const c=a.getContext('2d');if(bg)fill(c,0,0,800,340,bg);const im=imgs[key];if(!im)return a;let scale=Math.min(730/im.width,260/im.height),w=im.width*scale,h=im.height*scale,x=(800-w)/2,y=(340-h)/2;c.drawImage(im,x,y,w,h);if(mode==='black'||mode==='white'||mode==='primary'){c.globalCompositeOperation='source-in';fill(c,0,0,800,340,mode==='black'?'#080808':mode==='white'?'#FFFFFF':S.primary);c.globalCompositeOperation='source-over'}return a}
function variant(c,key,mode,x,y,w,h,bg){panel(c,x,y,w,h,bg||'#F4F0E9');if(!imgs[key]){placeholder(c,x,y,w,h,'Carregar original');return}let v=variantCanvas(key,mode),ratio=Math.min((w-28)/v.width,(h-28)/v.height);c.drawImage(v,x+(w-v.width*ratio)/2,y+(h-v.height*ratio)/2,v.width*ratio,v.height*ratio)}
function pattern(c,x,y,w,h){
 c.save();c.beginPath();c.rect(x,y,w,h);c.clip();fill(c,x,y,w,h,S.secondary);
 const im=S.patternMode==='upload'?imgs.pattern:imgs.symbol;
 if(!im){txt(c,S.patternMode==='upload'?'Importar pattern SVG/PNG':'Carregar símbolo para gerar pattern',x+20,y+h/2,18,'#888');c.restore();return}
 const size=Math.max(8,Number(S.patternScale)||72),gap=Math.max(0,Number(S.patternGap)||0),step=Math.max(8,size+gap),rot=(Number(S.patternRotation)||0)*Math.PI/180,layout=S.patternLayout||'stagger';
 const ratio=Math.min(size/im.naturalWidth,size/im.naturalHeight),iw=im.naturalWidth*ratio,ih=im.naturalHeight*ratio;
 const extra=Math.ceil(Math.hypot(w,h)/step)+3,centerX=x+w/2,centerY=y+h/2;
 for(let row=-extra;row<=extra;row++)for(let col=-extra;col<=extra;col++){
  const dx=layout==='stagger'&&row%2?step/2:layout==='diagonal'?row*step*.25:0;
  const px=centerX+col*step+dx,py=centerY+row*step;
  if(px<x-size||px>x+w+size||py<y-size||py>y+h+size)continue;
  c.save();c.translate(px,py);c.rotate(rot);c.drawImage(im,-iw/2,-ih/2,iw,ih);c.restore();
 }
 c.restore();
}
function card(c,key,x,y,w,h,title){if(imgs[key])photo(c,key,x,y,w,h-48);else if(['stationery','social','campaign'].includes(key)){const kind={stationery:'business',social:'social',campaign:'outdoor'}[key];drawConceptMockup(c,kind,x,y,w,h-48);txt(c,'SIMULAÇÃO GRÁFICA · substituir por aplicação real',x+12,y+h-72,15,'#555','Arial','normal',w-24)}else photo(c,key,x,y,w,h-48);txt(c,title,x,y+h-12,19,'#24211F',fontFamilies.h2,'bold',w)}
function drawConceptMockup(c,kind,x,y,w,h){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();fill(c,x,y,w,h,'#EAE7E2');let rx=x+w*.12,ry=y+h*.13,rw=w*.76,rh=h*.65;if(kind==='outdoor'){rx=x+w*.06;ry=y+h*.28;rw=w*.88;rh=h*.38}if(kind==='social'){rw=Math.min(w*.60,h*.66);rh=rw;rx=x+(w-rw)/2;ry=y+(h-rh)/2}fill(c,rx+12,ry+12,rw,rh,'#D7D1C9');fill(c,rx,ry,rw,rh,kind==='social'?S.primary:S.secondary);if(imgs.logo){let margin=rw*.1;logo(c,rx+margin,ry+rh*.2,rw-2*margin,rh*.6)}else txt(c,'ADICIONAR LOGÓTIPO',rx+18,ry+rh*.5,19,'#666','Arial','normal',rw-36);c.restore()}
function renderPage(n,c){c.save();frame(c,n);if(n===0){fill(c,0,80,W,950,'#FFFFFF');fill(c,0,80,16,950,S.primary);logo(c,65,260,770,430);txt(c,'BRAND GUIDELINES',M,190,19,'#111111','Arial','bold');txt(c,S.tagline||'SISTEMA DE IDENTIDADE VISUAL',M,935,25,'#111111',fontFamilies.h2,'normal',760);txt(c,'IDENTIDADE  /  '+new Date().getFullYear(),M,1112,16,'#555');c.restore();return}
heading(c,n);switch(n){
case 1:label(c,'A MARCA',M,278);para(c,S.essence||'Define aqui a essência da marca para apresentar a sua visão de forma clara.',M,335,735,33,51,'#272321',fontFamilies.h2,8);panel(c,M,710,768,290,S.secondary);label(c,'PERSONALIDADE',M+30,760);para(c,S.personality||'Adiciona os atributos que definem a personalidade desta identidade.',M+30,815,700,24,39,'#292421',fontFamilies.h3,5);break;
case 2:panel(c,M,255,768,480,S.secondary);logo(c,M+28,290,712,395);label(c,'CONCEITO',M,795);para(c,S.concept||'Descreve o conceito criativo que deu origem ao logótipo e às suas decisões formais.',M,850,730,24,39,'#2A2724',fontFamilies.h3,6);break;
case 3:panel(c,M,260,768,450,S.secondary);logo(c,M+20,280,730,380);label(c,'ELEMENTOS DO SISTEMA',M,775);variant(c,'symbol','primary',M,810,245,235,'#F3EEE7');pattern(c,M+270,810,498,235);break;
case 4:panel(c,M,265,768,610,S.secondary);logo(c,M+22,340,724,440);caption(c,'Versão oficial da marca. Preservar proporções e desenho original.',935);break;
case 5:variant(c,'logo','original',M,265,368,270,S.secondary);variant(c,'logo','black',M+398,265,370,270,'#FFFFFF');variant(c,'logo','white',M,580,368,270,'#111111');variant(c,'logo','primary',M+398,580,370,270,S.secondary);caption(c,'Original  ·  Preto  ·  Branco  ·  Cor principal',925);break;
case 6:variant(c,'symbol','primary',M,275,768,525,S.secondary);variant(c,'symbol','black',M,835,232,205,'#FFFFFF');variant(c,'symbol','white',M+267,835,232,205,'#111111');variant(c,'symbol','original',M+535,835,233,205,S.secondary);break;
case 7:panel(c,M,260,768,630,S.secondary);c.strokeStyle=S.primary;c.lineWidth=3;c.strokeRect(M+80,345,608,430);variant(c,'logo','original',M+115,385,538,340,'#FFFFFF');caption(c,`Margem de segurança: ${S.safeArea}% · Impressão: ${S.minPrint} mm · Digital: ${S.minDigital} px`,960);break;
case 8:variant(c,'logo','original',M,270,365,260,S.secondary);variant(c,'logo','black',M+403,270,365,260,'#FFFFFF');label(c,'✓ PRESERVAR PROPORÇÕES',M,565);label(c,'✓ GARANTIR CONTRASTE',M+403,565);variant(c,'logo','primary',M,650,365,260,S.secondary);variant(c,'logo','white',M+403,650,365,260,'#111111');label(c,'× NÃO DISTORCER',M,952);label(c,'× NÃO ALTERAR ARBITRARIAMENTE',M+403,952);break;
case 9:swatch(c,S.primary,M,300,362,470,'PRINCIPAL');swatch(c,S.secondary,M+406,300,362,470,'SECUNDÁRIA');caption(c,'Valores técnicos RGB / CMYK na página seguinte.',880);break;
case 10:{const colors=[S.primary,S.secondary,S.support1,S.support2];colors.forEach((col,i)=>{let x=M+(i%2)*405,y=265+Math.floor(i/2)*385;fill(c,x,y,355,230,col);txt(c,['PRINCIPAL','SECUNDÁRIA','APOIO 01','APOIO 02'][i],x,y+265,19,'#222','Arial','bold');let [r,g,b]=rgb(col),k=1-Math.max(r,g,b)/255,cm=k===1?[0,0,0,100]:[Math.round((1-r/255-k)/(1-k)*100),Math.round((1-g/255-k)/(1-k)*100),Math.round((1-b/255-k)/(1-k)*100),Math.round(k*100)];txt(c,`${col.toUpperCase()}  ·  RGB ${r}, ${g}, ${b}`,x,y+298,17,'#555');txt(c,`CMYK ${cm.join(' / ')} (aprox.)`,x,y+324,16,'#777')});break}
case 11:label(c,'H1 / TÍTULOS',M,290);txt(c,'Aa Bb Cc 0123',M,380,67,'#24211F',fontFamilies.h1,'normal',755);label(c,'H2 / SUBTÍTULOS',M,495);txt(c,'Aa Bb Cc 0123',M,580,52,'#24211F',fontFamilies.h2,'normal',755);label(c,'H3 / TEXTO DE CORPO',M,695);txt(c,'Aa Bb Cc 0123',M,755,36,'#24211F',fontFamilies.h3,'normal',755);line(c,M,820,RIGHT,820);['h1','h2','h3'].forEach((k,i)=>txt(c,`${k.toUpperCase()} — ${S.fonts[k]?.name||'Fonte padrão do sistema'}`,M,875+i*55,20,'#777'));break;
case 12:label(c,'H1 / DESTAQUE',M,285);txt(c,'Uma ideia com identidade.',M,380,50,S.primary,fontFamilies.h1,'normal',760);label(c,'H2 / TÍTULO SECUNDÁRIO',M,515);txt(c,'Linguagem visual consistente',M,585,37,'#222',fontFamilies.h2,'normal',760);label(c,'H3 / CORPO',M,730);para(c,'A tipografia estabelece uma hierarquia clara e cria ritmo entre títulos, subtítulos, texto corrido e legendas em todos os suportes da marca.',M,800,725,26,42,'#333',fontFamilies.h3,6);break;
case 13:pattern(c,M,260,768,570);label(c,S.patternMode==='upload'?'PATTERN IMPORTADO':'PATTERN GERADO A PARTIR DO SÍMBOLO',M,875);caption(c,'Aplicar apenas em suportes com legibilidade e contraste adequados.',925);break;
case 14:card(c,'stationery',M,260,768,710,'Estacionário / cartões de visita');break;
case 15:card(c,'social',M,260,768,710,'Aplicações digitais / redes sociais');break;
case 16:card(c,'campaign',M,260,768,710,'Campanha / publicidade');break;
case 17:card(c,'photo',M,260,768,710,'Fotografia / direção de arte');break;
case 18:{let b=boardCanvas();let sc=Math.min(768/b.width,830/b.height);c.drawImage(b,M,265,b.width*sc,b.height*sc);break;}
case 19:panel(c,M,260,768,630,S.secondary);logo(c,M+30,310,708,350);txt(c,'IDENTIDADE VISUAL',M+35,755,22,'#555','Arial','bold');txt(c,S.credits||'Créditos por definir',M+35,810,21,'#555');txt(c,new Date().getFullYear(),M+35,850,18,'#555');break;
}c.restore()}
function render(){for(let id of fields){let e=$(id);if(e)S[id]=e.value}renderPage(currentPage,ctx);$('pageCounter').textContent=String(currentPage+1).padStart(2,'0')+' / 20';$('pageSelect').value=String(currentPage);renderPalette();renderPattern();renderFonts();renderMockup()}
function renderPalette(){let e=$('palettePreview');e.innerHTML='';[S.primary,S.secondary,S.support1,S.support2].forEach(v=>{let d=document.createElement('div'),i=document.createElement('i'),s=document.createElement('small');i.style.background=v;s.textContent=v.toUpperCase();d.append(i,s);e.append(d)})}
function renderPattern(){let c=$('patternPreview').getContext('2d');pattern(c,0,0,540,260)}
function renderFonts(){let e=$('fontPreview');e.innerHTML='';['h1','h2','h3'].forEach((k,i)=>{let d=document.createElement('div');d.style.fontFamily=fontFamilies[k];d.style.fontSize=[30,23,17][i]+'px';d.style.padding='7px';d.textContent=k.toUpperCase()+' — Aa Bb Cc 0123456789';e.append(d)})}
function imageFromData(key,data){return new Promise(resolve=>{if(!data){delete imgs[key];resolve();return}const im=new Image();im.onload=()=>{imgs[key]=im;resolve()};im.onerror=()=>{delete imgs[key];resolve()};im.src=data})}
function fileData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
async function loadFont(k,data,name){if(!data)return;try{let face=new FontFace('Uploaded_'+k,`url(${data})`);await face.load();document.fonts.add(face);fontFamilies[k]='Uploaded_'+k;S.fonts[k]={data,name}}catch(e){alert('Não foi possível carregar a fonte '+name)}}
async function hydrate(){for(let [k,v] of Object.entries(S.assets||{}))await imageFromData(k,v.data);for(let [k,v] of Object.entries(S.fonts||{}))await loadFont(k,v.data,v.name);fields.forEach(k=>{if($(k))$(k).value=S[k]||''});document.querySelector(`input[name=patternMode][value="${S.patternMode}"]`).checked=true;$('patternUploadLabel').hidden=S.patternMode!=='upload';render()}
function dataURLBlob(data){let [h,body]=data.split(','),mime=h.match(/data:(.*?);/)?.[1]||'application/octet-stream',bytes=atob(body),a=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)a[i]=bytes.charCodeAt(i);return new Blob([a],{type:mime})}
function download(blob,name){let u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000)}
function pageCanvas(n,scale=1){let c=document.createElement('canvas');c.width=Math.round(W*scale);c.height=Math.round(H*scale);const q=c.getContext('2d');q.scale(scale,scale);renderPage(n,q);return c}
async function makePdf(){
  await document.fonts.ready;
  const enc=new TextEncoder(),chunks=[],offsets=[0];let pos=0;
  const add=(data)=>{let bytes=typeof data==='string'?enc.encode(data):data;chunks.push(bytes);pos+=bytes.length};
  const object=(id,body)=>{offsets[id]=pos;add(`${id} 0 obj\n`);add(body);add('\nendobj\n')};
  const jpegBytes=async(c)=>new Uint8Array(await (await imageBlob(c,'image/jpeg',.94)).arrayBuffer());
  add('%PDF-1.4\n%----\n');
  object(1,'<< /Type /Catalog /Pages 2 0 R >>');
  object(2,'<< /Type /Pages /Kids ['+Array.from({length:20},(_,i)=>`${3+i*3} 0 R`).join(' ') +'] /Count 20 >>');
  for(let n=0;n<20;n++){
    let pageId=3+n*3,imgId=pageId+1,contentId=pageId+2;
    const highRes=3; const highResCanvas=pageCanvas(n,highRes); const pic=await jpegBytes(highResCanvas);
    object(pageId,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.276 841.89] /Resources << /XObject << /Im0 ${imgId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    offsets[imgId]=pos;add(`${imgId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${highResCanvas.width} /Height ${highResCanvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pic.length} >>\nstream\n`);add(pic);add('\nendstream\nendobj\n');
    const content='q\n595.276 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
    object(contentId,`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);
    await new Promise(r=>setTimeout(r,0));
  }
  const start=pos;add(`xref\n0 63\n0000000000 65535 f \n`);for(let i=1;i<=62;i++)add(String(offsets[i]).padStart(10,'0')+' 00000 n \n');
  add(`trailer\n<< /Size 63 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
  return new Blob(chunks,{type:'application/pdf'});
}
function boardCanvas(){
 const b=document.createElement('canvas');b.width=1200;b.height=1000;const c=b.getContext('2d');const g=10,tw=380,th=320,cols=[S.primary,S.secondary,S.support1,S.support2];
 fill(c,0,0,1200,1000,'#EAE5DE');
 const tile=(col,row,color)=>{let x=g+col*(tw+g),y=g+row*(th+g);fill(c,x,y,tw,th,color);return [x,y]};
 let [x,y]=tile(0,0,S.primary);txt(c,'01 / BRAND IDENTITY',x+18,y+28,14,'#FFFFFF','Arial','bold');variant(c,'logo','white',x+12,y+55,tw-24,170,S.primary);txt(c,S.tagline||'IDENTIDADE VISUAL',x+20,y+280,18,'#FFFFFF','Arial','bold',tw-40);
 [x,y]=tile(1,0,S.secondary);txt(c,'02 / ESSÊNCIA',x+20,y+28,14,'#181818','Arial','bold');para(c,S.essence||S.tagline||S.brandName,x+20,y+92,tw-40,29,42,'#181818',fontFamilies.h1,4);
 [x,y]=tile(2,0,S.primary);txt(c,'03 / SIGNATURE MARK',x+20,y+28,14,'#FFFFFF','Arial','bold');variant(c,'logo','white',x+12,y+65,tw-24,205,S.primary);
 [x,y]=tile(0,1,'#FFFFFF');txt(c,'04 / TIPOGRAFIA',x+20,y+28,14,'#171717','Arial','bold');txt(c,'Aa Bb Cc',x+20,y+117,46,'#181818',fontFamilies.h1,'normal',tw-40);txt(c,'Subtítulo da marca',x+20,y+188,28,'#181818',fontFamilies.h2,'normal',tw-40);txt(c,'Corpo de texto / 0123456789',x+20,y+242,18,'#181818',fontFamilies.h3,'normal',tw-40);
 [x,y]=tile(1,1,'#FFFFFF');txt(c,'05 / APLICAÇÃO',x+20,y+28,14,'#171717','Arial','bold');if(imgs.stationery)photo(c,'stationery',x+18,y+50,tw-36,225);else drawConceptMockup(c,'business',x+18,y+50,tw-36,225);
 [x,y]=tile(2,1,'#F8F6F2');txt(c,'06 / DIGITAL',x+20,y+28,14,'#171717','Arial','bold');if(imgs.social)photo(c,'social',x+18,y+50,tw-36,225);else drawConceptMockup(c,'social',x+18,y+50,tw-36,225);
 [x,y]=tile(0,2,S.secondary);txt(c,'07 / PATTERN',x+20,y+28,14,'#181818','Arial','bold');pattern(c,x+16,y+47,tw-32,245);
 [x,y]=tile(1,2,'#FFFFFF');txt(c,'08 / IDENTIDADE',x+20,y+28,14,'#171717','Arial','bold');variant(c,'symbol','primary',x+15,y+55,180,180,S.secondary);cols.forEach((col,i)=>fill(c,x+205+i*37,y+120,34,80,col));
 [x,y]=tile(2,2,'#FFFFFF');txt(c,'09 / REAL WORLD',x+20,y+28,14,'#171717','Arial','bold');if(imgs.campaign)photo(c,'campaign',x+18,y+54,tw-36,218);else if(imgs.photo)photo(c,'photo',x+18,y+54,tw-36,218);else drawConceptMockup(c,'outdoor',x+18,y+54,tw-36,218);
 return b;
}
function patternCanvas(){let c=document.createElement('canvas');c.width=1080;c.height=1080;pattern(c.getContext('2d'),0,0,1080,1080);return c}
function pngBlob(c){return new Promise(r=>c.toBlob(r,'image/png'))}
function imageBlob(c,type='image/jpeg',quality=.94){return new Promise(r=>c.toBlob(r,type,quality))}
async function icoBlob(c){const png=new Uint8Array(await (await pngBlob(c)).arrayBuffer()),b=new ArrayBuffer(22+png.length),v=new DataView(b);v.setUint16(0,0,true);v.setUint16(2,1,true);v.setUint16(4,1,true);v.setUint8(6,c.width===256?0:c.width);v.setUint8(7,c.height===256?0:c.height);v.setUint8(8,0);v.setUint8(9,0);v.setUint16(10,1,true);v.setUint16(12,32,true);v.setUint32(14,png.length,true);v.setUint32(18,22,true);new Uint8Array(b,22).set(png);return new Blob([b],{type:'image/x-icon'})}

async function makeZip(){if(!window.JSZip)throw Error('Biblioteca ZIP não carregada.');let zip=new JSZip(),folder=zip.folder(escName());folder.file('Brand-Guidelines-A4.pdf',await makePdf());folder.file('Brand-Board.png',await pngBlob(boardCanvas()));folder.file('Pattern.png',await pngBlob(patternCanvas()));folder.file('Paleta.json',JSON.stringify({principal:S.primary,secundaria:S.secondary,apoio1:S.support1,apoio2:S.support2},null,2));folder.file('Paleta.txt',`Principal: ${S.primary}\nSecundária: ${S.secondary}\nApoio 1: ${S.support1}\nApoio 2: ${S.support2}\n`);for(let key of ['logo','symbol']){if(!imgs[key])continue;let dir=folder.folder(key==='logo'?'Logotipos':'Simbolo');let a=S.assets[key];if(a)dir.file('Original.'+(a.name.split('.').pop()||'png'),dataURLBlob(a.data));for(let mode of ['original','black','white','primary']){let rendered=variantCanvas(key,mode);dir.file(mode+'.png',await pngBlob(rendered));dir.file(mode+'.webp',await imageBlob(rendered,'image/webp'));if(mode==='original')dir.file(mode+'.jpg',await imageBlob(rendered,'image/jpeg'));for(let [bgName,bg] of [['sobre-branco','#FFFFFF'],['sobre-preto','#000000'],['sobre-secundaria',S.secondary]]){if((mode==='black'&&bgName==='sobre-branco')||(mode==='white'&&bgName==='sobre-preto')||(mode==='primary'&&bgName==='sobre-secundaria'))dir.file(mode+'-'+bgName+'.png',await pngBlob(variantCanvas(key,mode,bg)))}}}
if(imgs.symbol){let f=folder.folder('Favicons');for(let size of [16,24,32,64,128])for(let mode of ['original','black','white','primary']){let c=document.createElement('canvas');c.width=c.height=size;c.getContext('2d').drawImage(variantCanvas('symbol',mode),0,0,size,size);f.file(`favicon-${mode}-${size}.png`,await pngBlob(c));if(size===32)f.file(`favicon-${mode}.ico`,await icoBlob(c))}}
for(let [key,a] of Object.entries(S.assets))if(!['logo','symbol'].includes(key)&&a)folder.file('Materiais/'+key+'-'+a.name,dataURLBlob(a.data));for(let [k,f] of Object.entries(S.fonts))if(f)folder.file('Fontes/'+k+'-'+f.name,dataURLBlob(f.data));return zip.generateAsync({type:'blob',compression:'DEFLATE'})}
function status(s){$('exportStatus').textContent=s}
async function busy(button,fn){button.disabled=true;const original=button.textContent;button.textContent='A preparar…';status('A processar ficheiros…');try{await fn();status('Exportação concluída.')}catch(e){status('Erro: '+e.message);alert(e.message)}finally{button.disabled=false;button.textContent=original}}
function setPage(n){currentPage=Math.max(0,Math.min(19,n));render()}
function renderThumbs(){const e=$('thumbnails');e.innerHTML='';for(let i=0;i<20;i++){let b=document.createElement('button'),p=pageCanvas(i);b.append(p);b.title=String(i+1)+' — '+pageTitles[i];b.onclick=()=>setPage(i);e.append(b)}}
function init(){pageTitles.forEach((v,i)=>{let o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+v;$('pageSelect').append(o)});document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('active',p.id==='tab-'+b.dataset.tab));if(b.dataset.tab==='guide')render()});fields.forEach(id=>$(id)?.addEventListener('input',render));document.querySelectorAll('[data-asset]').forEach(e=>e.addEventListener('change',async()=>{let f=e.files?.[0];if(!f)return;let data=await fileData(f);S.assets[e.dataset.asset]={data,name:f.name};await imageFromData(e.dataset.asset,data);render()}));document.querySelectorAll('[data-font]').forEach(e=>e.addEventListener('change',async()=>{let f=e.files?.[0];if(!f)return;await loadFont(e.dataset.font,await fileData(f),f.name);render()}));document.querySelectorAll('input[name=patternMode]').forEach(e=>e.addEventListener('change',()=>{S.patternMode=e.value;$('patternUploadLabel').hidden=e.value!=='upload';render()}));$('pageSelect').onchange=e=>setPage(+e.target.value);$('prevPage').onclick=()=>setPage(currentPage-1);$('nextPage').onclick=()=>setPage(currentPage+1);$('refresh').onclick=render;$('allPages').onclick=()=>{let e=$('thumbnails');e.hidden=!e.hidden;if(!e.hidden)renderThumbs()};$('generatePalette').onclick=()=>{let h=parseInt(S.primary.slice(1),16),r=(h>>16)&255,g=(h>>8)&255,b=h&255;let hue=(Math.atan2(Math.sqrt(3)*(g-b),2*r-g-b)*180/Math.PI+360)%360;function hsv(h,s,v){let f=n=>{let k=(n+h/60)%6;return Math.round((v-v*s*Math.max(Math.min(k,4-k,1),0))*255)};return '#'+[f(5),f(3),f(1)].map(v=>v.toString(16).padStart(2,'0')).join('')}S.support1=hsv((hue+137.5)%360,.55,.66);S.support2=hsv((hue+275)%360,.22,.84);$('support1').value=S.support1;$('support2').value=S.support2;render()};$('saveProject').onclick=()=>{render();download(new Blob([JSON.stringify({format:'LogoPackStudioClean1',...S},null,2)],{type:'application/json'}),escName()+'-projeto.json')};$('openProject').onchange=async e=>{let f=e.target.files?.[0];if(!f)return;try{let d=JSON.parse(await f.text());if(d.format!=='LogoPackStudioClean1')throw Error('Formato de projeto incompatível');Object.assign(S,d);await hydrate()}catch(err){alert('Não foi possível abrir: '+err.message)}};$('newProject').onclick=()=>{if(confirm('Criar novo projeto? Guarda o atual em JSON primeiro.'))location.reload()};$('exportPdf').onclick=e=>busy(e.target,async()=>download(await makePdf(),escName()+'-Brand-Guidelines.pdf'));$('exportPdf2').onclick=e=>busy(e.target,async()=>download(await makePdf(),escName()+'-Brand-Guidelines.pdf'));$('exportBoard').onclick=e=>busy(e.target,async()=>download(await pngBlob(boardCanvas()),escName()+'-Brand-Board.png'));$('exportPattern').onclick=e=>busy(e.target,async()=>download(await pngBlob(patternCanvas()),escName()+'-Pattern.png'));$('exportZip').onclick=e=>busy(e.target,async()=>download(await makeZip(),escName()+'-Brand-Pack.zip'));render()}
init();


// FOUNDATION: palette, original SVG-preserving variants, brand package and validation.
function hexRgb(h){let [r,g,b]=rgb(h);return {r,g,b}}
function colorCodes(h){const {r,g,b}=hexRgb(h),k=1-Math.max(r,g,b)/255;let v=k>=1?[0,0,0,100]:[Math.round((1-r/255-k)/(1-k)*100),Math.round((1-g/255-k)/(1-k)*100),Math.round((1-b/255-k)/(1-k)*100),Math.round(k*100)];return {HEX:h.toUpperCase(),RGB:`${r}, ${g}, ${b}`,CMYK:`${v.join(' / ')} (aprox.)`}}
function rgbHsl(h){let [r,g,b]=rgb(h).map(x=>x/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2,s=d===0?0:d/(1-Math.abs(2*l-1)),hu=0;if(d){switch(max){case r:hu=((g-b)/d)%6;break;case g:hu=(b-r)/d+2;break;default:hu=(r-g)/d+4}hu*=60}return [(hu+360)%360,s,l]}
function hslHex(h,s,l){h=((h%360)+360)%360;let a=s*Math.min(l,1-l);let f=n=>{let k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return '#'+[f(0),f(8),f(4)].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
function generateColors(){const [h,s,l]=rgbHsl(S.primary),m=$('paletteMethod').value,offsets={golden:[137.5,275,52.5],analogous:[30,330,60],triadic:[120,240,180],complementary:[180,155,205]}[m];let cs=offsets.map((o,i)=>hslHex(h+o,Math.max(.22,Math.min(.75,s*(i===1?.65:.85))),Math.max(.25,Math.min(.84,l+(i===1?.16:.06)))));if($('autoSecondary').checked){S.secondary=cs[0];$('secondary').value=S.secondary}S.support1=cs[1];S.support2=cs[2];$('support1').value=S.support1;$('support2').value=S.support2;render()}
function svgEscape(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function paletteSVG(){const cols=[S.primary,S.secondary,S.support1,S.support2],names=['PRINCIPAL','SECUNDÁRIA','APOIO 01','APOIO 02'];let parts=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">','<rect width="1200" height="720" fill="#FFFFFF"/>','<text x="60" y="85" font-family="Arial" font-size="44" fill="#171717">PALETA CROMÁTICA</text>'];cols.forEach((c,i)=>{let x=60+i*280,k=colorCodes(c);parts.push(`<rect x="${x}" y="145" width="250" height="310" fill="${c}"/><text x="${x}" y="500" font-family="Arial" font-size="23" font-weight="bold" fill="#171717">${names[i]}</text><text x="${x}" y="540" font-family="Arial" font-size="19" fill="#171717">${k.HEX}</text><text x="${x}" y="572" font-family="Arial" font-size="17" fill="#171717">RGB ${k.RGB}</text><text x="${x}" y="604" font-family="Arial" font-size="16" fill="#171717">CMYK ${k.CMYK}</text>`)});parts.push('</svg>');return parts.join('')}
function getOriginalSvg(key){let asset=S.assets[key];if(!asset?.name.toLowerCase().endsWith('.svg'))return null;try{return atob(asset.data.split(',')[1])}catch(e){try{return decodeURIComponent(asset.data.split(',')[1])}catch{return null}}}
function svgVariant(key,mode,bg=null){let a=S.assets[key];if(!a)return null;const original=getOriginalSvg(key),base=original?`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(original)))}`:a.data;let color=mode==='black'?'#000000':mode==='white'?'#FFFFFF':mode==='primary'?S.primary:null;let inner=color?`<mask id="shape" mask-type="alpha" maskUnits="userSpaceOnUse"><image href="${base}" x="0" y="0" width="1000" height="600" preserveAspectRatio="xMidYMid meet"/></mask><rect x="0" y="0" width="1000" height="600" fill="${color}" mask="url(#shape)"/>`:`<image href="${base}" x="0" y="0" width="1000" height="600" preserveAspectRatio="xMidYMid meet"/>`;return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 600" width="1000" height="600">${bg?`<rect width="1000" height="600" fill="${bg}"/>`:''}${inner}</svg>`}
function variantTransparentCanvas(key,mode,bg){const a=document.createElement('canvas');a.width=1200;a.height=720;const c=a.getContext('2d');if(bg)fill(c,0,0,1200,720,bg);let im=imgs[key];if(!im)return a;const pad=60,sc=Math.min((1200-pad*2)/im.width,(720-pad*2)/im.height),w=im.width*sc,h=im.height*sc;c.drawImage(im,(1200-w)/2,(720-h)/2,w,h);if(mode!=='original'){let colored=document.createElement('canvas');colored.width=1200;colored.height=720;let q=colored.getContext('2d');q.drawImage(im,(1200-w)/2,(720-h)/2,w,h);q.globalCompositeOperation='source-in';fill(q,0,0,1200,720,mode==='black'?'#000000':mode==='white'?'#FFFFFF':S.primary);c.clearRect(0,0,1200,720);if(bg)fill(c,0,0,1200,720,bg);c.drawImage(colored,0,0)}return a}
function faviconCanvas(key,mode,size){let a=document.createElement('canvas');a.width=a.height=size;let c=a.getContext('2d'),im=imgs[key];if(!im)return a;let pad=Math.max(1,Math.round(size*.08)),scale=Math.min((size-2*pad)/im.width,(size-2*pad)/im.height),w=im.width*scale,h=im.height*scale;c.drawImage(im,(size-w)/2,(size-h)/2,w,h);if(mode!=='original'){c.globalCompositeOperation='source-in';fill(c,0,0,size,size,mode==='black'?'#000000':mode==='white'?'#FFFFFF':S.primary);c.globalCompositeOperation='source-over'}return a}
function projectWarnings(){let w=[];if(!S.assets.logo)w.push('Falta o logótipo original.');if(!S.assets.symbol)w.push('Falta o símbolo para os favicons e patterns.');for(let k of ['h1','h2','h3'])if(!S.fonts[k])w.push(`Fonte ${k.toUpperCase()} não carregada (será utilizada uma fonte de sistema).`);for(let k of ['stationery','social','campaign','photo'])if(!S.assets[k])w.push(`Aplicação ${k} sem imagem real; aparecerá um marcador de material em falta.`);if(!window.JSZip)w.push('Motor ZIP indisponível.');return w}
function showValidation(){let v=projectWarnings();$('validation').innerHTML=v.length?'<strong>Verificações:</strong><ul>'+v.map(x=>`<li>${svgEscape(x)}</li>`).join('')+'</ul>':'<strong>Todos os elementos principais estão presentes.</strong>';return v}
function renderMockup(){let c=$('mockupPreview');if(!c)return;c.innerHTML='';let t=$('mockupType').value,el=document.createElement('canvas');el.width=660;el.height=400;let q=el.getContext('2d');fill(q,0,0,660,400,'#EAE7E2');if(t==='business'){q.save();q.translate(80,55);q.rotate(-.07);fill(q,0,0,490,285,S.secondary);if(imgs.logo)fitImg(q,'logo',38,62,414,145,10);else txt(q,'CARREGAR LOGÓTIPO',50,140,23,'#666');q.restore()}else if(t==='social'||t==='story'){let w=t==='story'?220:350,x=(660-w)/2;fill(q,x,22,w,356,S.primary);if(imgs.logo){q.save();q.translate(x+20,80);fitImg(q,'logo',0,0,w-40,180,4);q.restore()}else txt(q,'LOGÓTIPO',x+40,180,24,'#FFFFFF');txt(q,t==='story'?'STORY 9:16':'POST 1:1',x+22,347,17,'#FFFFFF')}else if(t==='poster'){fill(q,140,18,380,365,S.secondary);if(imgs.logo)fitImg(q,'logo',170,115,320,160,5);txt(q,S.brandName,180,315,24,'#181818')}else{fill(q,40,115,580,200,'#D9D7D2');fill(q,55,130,550,170,S.secondary);if(imgs.logo)fitImg(q,'logo',90,140,480,145,5)}c.append(el)}
async function loadMockupLibrary(){let u=$('mockupManifest').value.trim();if(!u){$('libraryStatus').textContent='Indica um URL para um ficheiro JSON alojado no GitHub.';return}try{let url=new URL(u);if(url.protocol!=='https:')throw Error('É necessário HTTPS');let r=await fetch(u);if(!r.ok)throw Error('HTTP '+r.status);let j=await r.json();if(!Array.isArray(j.mockups))throw Error('Formato esperado: {"mockups":[...]}');let opts=j.mockups.filter(x=>x&&typeof x.name==='string'&&typeof x.image==='string'&&/^https:\/\//.test(x.image));$('libraryStatus').textContent=`${opts.length} mockups listados. Usa o upload para integrar imagens nos materiais.`;let grid=document.createElement('div');grid.className='library-grid';for(let m of opts.slice(0,20)){let card=document.createElement('div'),im=document.createElement('img'),b=document.createElement('button');im.src=m.image;im.loading='lazy';im.alt=m.name;b.textContent='Abrir imagem';b.onclick=()=>window.open(m.image,'_blank','noopener');card.append(im,document.createTextNode(m.name),b);grid.append(card)}$('libraryStatus').append(grid)}catch(e){$('libraryStatus').textContent='Não foi possível carregar a biblioteca: '+e.message}}
function filenameSafe(v){return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_.-]/g,'-').replace(/-+/g,'-').slice(0,80)}
async function makeZipFoundation(){if(!window.JSZip)throw Error('Biblioteca ZIP indisponível.');let z=new JSZip(),root=z.folder(escName()+'-Brand-Pack');root.file('09_Brand-Guidelines/Brand-Guidelines-A4.pdf',await makePdf());root.file('08_Brand-Board/Brand-Board.png',await pngBlob(boardCanvas()));root.file('04_Cores/Paleta.svg',paletteSVG());let palette={principal:colorCodes(S.primary),secundaria:colorCodes(S.secondary),apoio1:colorCodes(S.support1),apoio2:colorCodes(S.support2)};root.file('04_Cores/Paleta.json',JSON.stringify(palette,null,2));root.file('04_Cores/Codigos.txt',Object.entries(palette).map(([k,v])=>`${k}: ${v.HEX} | RGB ${v.RGB} | CMYK ${v.CMYK}`).join('\n'));root.file('05_Tipografia/Referencias.txt',['h1','h2','h3'].map(k=>`${k.toUpperCase()}: ${S.fonts[k]?.name||'Não carregada'}`).join('\n')+'\nFontes não incluídas por motivos de licenciamento.');root.file('06_Patterns/Pattern.png',await pngBlob(patternCanvas()));if(S.assets.pattern)root.file('06_Patterns/Original-'+filenameSafe(S.assets.pattern.name),dataURLBlob(S.assets.pattern.data));for(let k of ['stationery','social','campaign','photo']){let a=S.assets[k];if(a)root.file('07_Aplicacoes/'+filenameSafe(a.name),dataURLBlob(a.data))}for(let key of ['logo','symbol']){if(!S.assets[key])continue;let dir=key==='logo'?'01_Logotipo':'02_Simbolo',original=S.assets[key];root.file(dir+'/Original/'+filenameSafe(original.name),dataURLBlob(original.data));for(let [name,mode,bg] of [['Original','original',null],['Preto','black',null],['Branco','white',null],['Original-sobre-secundaria','original',S.secondary],['Original-sobre-terciaria','original',S.support1],['Preto-sobre-branco','black','#FFFFFF'],['Branco-sobre-preto','white','#000000']]){let c=variantTransparentCanvas(key,mode,bg),stem=`${dir}/${name}/${filenameSafe(S.brandName)}-${key}-${name}`;root.file(stem+'.png',await pngBlob(c));let jpg=document.createElement('canvas');jpg.width=c.width;jpg.height=c.height;let j=jpg.getContext('2d');fill(j,0,0,jpg.width,jpg.height,bg||'#FFFFFF');j.drawImage(c,0,0);root.file(stem+'.jpg',await imageBlob(jpg,'image/jpeg',.93));root.file(stem+'.svg',svgVariant(key,mode,bg))}}
if(imgs.symbol){for(let mode of ['original','black','white','primary']){for(let size of [16,24,32,64,128]){let f=faviconCanvas('symbol',mode,size);root.file(`03_Favicons/${mode}/${size}.png`,await pngBlob(f))}root.file(`03_Favicons/${mode}/symbol.svg`,svgVariant('symbol',mode));root.file(`03_Favicons/${mode}/favicon.ico`,await icoBlob(faviconCanvas('symbol',mode,32)))}}root.file('Projeto.json',JSON.stringify({format:'LogoPackStudioClean1',...S},null,2));return z.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:5}})}
function foundationInit(){let gen=$('generatePalette');gen.onclick=generateColors;$('exportZip').onclick=e=>busy(e.target,async()=>{showValidation();download(await makeZipFoundation(),escName()+'-Brand-Pack.zip')});$('exportPalette').onclick=e=>busy(e.target,async()=>download(new Blob([paletteSVG()],{type:'image/svg+xml'}),escName()+'-Paleta.svg'));$('validateProject').onclick=showValidation;$('mockupType').onchange=e=>{S.mockupType=e.target.value;renderMockup()};$('loadLibrary').onclick=loadMockupLibrary;$('mockupManifest').onchange=e=>S.mockupManifest=e.target.value;renderMockup();}
foundationInit();

// Foundation V2 - standalone exports, pattern controls and extended brand board.
function patternSVG(){
 const key=S.patternMode==='upload'?'pattern':'symbol',im=imgs[key],source=S.assets[key]?.data;
 const size=Math.max(8,Number(S.patternScale)||72),gap=Math.max(0,Number(S.patternGap)||0),step=Math.max(8,size+gap),rot=Number(S.patternRotation)||0,layout=S.patternLayout||'stagger';
 let cells='';if(source&&im){const r=Math.min(size/im.naturalWidth,size/im.naturalHeight),iw=im.naturalWidth*r,ih=im.naturalHeight*r;
 const extra=Math.ceil(Math.hypot(1080,1080)/step)+3;
 for(let row=-extra;row<=extra;row++)for(let col=-extra;col<=extra;col++){
 const dx=layout==='stagger'&&row%2?step/2:layout==='diagonal'?row*step*.25:0;
 const x=540+col*step+dx,y=540+row*step;
 if(x< -size||x>1080+size||y< -size||y>1080+size)continue;
 cells+=`<image href="${source}" x="${x-iw/2}" y="${y-ih/2}" width="${iw}" height="${ih}" transform="rotate(${rot} ${x} ${y})"/>`;
 }}return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080"><rect width="1080" height="1080" fill="${S.secondary}"/>${cells}</svg>`;
}
$('patternSvg').onclick=()=>download(new Blob([patternSVG()],{type:'image/svg+xml'}),escName()+'-Pattern.svg');
$('patternPng').onclick=e=>busy(e.target,async()=>download(await pngBlob(patternCanvas()),escName()+'-Pattern.png'));
$('showBoard').onclick=()=>{let b=$('boardPreview'),p=$('pageCanvas'),active=b.hidden;b.hidden=!active;p.hidden=active;if(active){b.getContext('2d').drawImage(boardCanvas(),0,0);$('showBoard').textContent='Voltar ao PDF'}else $('showBoard').textContent='Brand Board'};
const _renderV2=render;render=function(){_renderV2();if(!$('boardPreview').hidden)$('boardPreview').getContext('2d').drawImage(boardCanvas(),0,0)};


// Foundation V3: UI theme is independent from the white-background A4 export.
(function(){
 const themeKey='logo-pack-studio-theme-v3';
 const btn=document.getElementById('themeToggle');
 function setTheme(mode){
  document.documentElement.dataset.theme=mode;
  btn.textContent=mode==='dark'?'☀ Modo claro':'☾ Modo escuro';
  btn.setAttribute('aria-pressed',String(mode==='dark'));
  try{localStorage.setItem(themeKey,mode)}catch(e){}
 }
 let saved='light';try{saved=localStorage.getItem(themeKey)||'light'}catch(e){}
 setTheme(saved==='dark'?'dark':'light');
 btn.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
 // Estimate the most frequent saturated, opaque colour of the original logo.
 // User can always override the detected colour in the colour input.
 function detectPrimary(img){
  if(!img||!img.naturalWidth)return null;
  const c=document.createElement('canvas');c.width=96;c.height=96;
  const q=c.getContext('2d',{willReadFrequently:true});
  const r=Math.min(88/img.naturalWidth,88/img.naturalHeight);
  q.drawImage(img,(96-img.naturalWidth*r)/2,(96-img.naturalHeight*r)/2,img.naturalWidth*r,img.naturalHeight*r);
  let data;try{data=q.getImageData(0,0,96,96).data}catch(e){return null}
  const bins=new Map();
  for(let i=0;i<data.length;i+=4){
   const [rr,gg,bb,a]=data.slice(i,i+4);
   if(a<180)continue;
   const max=Math.max(rr,gg,bb),min=Math.min(rr,gg,bb);
   if(max-min<34||max>247&&min>235||max<35)continue;
   const key=[rr,gg,bb].map(x=>Math.min(255,Math.round(x/16)*16));
   const hex='#'+key.map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
   bins.set(hex,(bins.get(hex)||0)+1);
  }
  return [...bins].sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
 }
 const logoInput=document.querySelector('[data-asset="logo"]');
 if(logoInput)logoInput.addEventListener('change',async()=>{
  // Existing upload handler is asynchronous; wait for it to decode the logo.
  const file=logoInput.files?.[0];if(!file)return;
  const image=await new Promise(resolve=>{
   const fr=new FileReader();fr.onload=()=>{let im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=fr.result};fr.onerror=()=>resolve(null);fr.readAsDataURL(file)
  });
  const color=detectPrimary(image);if(!color)return;
  S.primary=color;document.getElementById('primary').value=color;render();
 });
})();

// Foundation V4: deliberate editorial layouts for pages 9 and 10 (zero-based 8, 9).
const _renderPageV4=renderPage;
renderPage=function(n,c){
 if(n!==8&&n!==9)return _renderPageV4(n,c);
 c.save();frame(c,n);heading(c,n);
 if(n===9){
  const cols=[S.primary,S.secondary],names=['PRINCIPAL','SECUNDÁRIA'];
  cols.forEach((col,i)=>{const x=M+i*405,y=280,k=colorCodes(col);
   fill(c,x,y,362,430,col);txt(c,names[i],x,y+472,22,'#171717','Arial','bold');
   txt(c,`HEX  ${k.HEX}`,x,y+513,20,'#171717');
   txt(c,`RGB  ${k.RGB}`,x,y+549,20,'#171717');
   txt(c,`CMYK  ${k.CMYK}`,x,y+585,19,'#171717');
  });caption(c,'CMYK calculado matematicamente · confirmar perfil ICC na impressão.',1000);
 }else{
  const items=[
   {name:'NÃO DISTORCER',kind:'stretch'},
   {name:'NÃO RODAR',kind:'rotate'},
   {name:'NÃO ALTERAR CORES',kind:'recolor'},
   {name:'NÃO APLICAR EFEITOS',kind:'shadow'},
   {name:'NÃO CORTAR',kind:'crop'},
   {name:'NÃO USAR SEM CONTRASTE',kind:'contrast'}
  ];
  const cellW=365,cellH=240;
  items.forEach((it,i)=>{const col=i%2,row=Math.floor(i/2),x=M+col*403,y=265+row*302;
   fill(c,x,y,cellW,cellH,'#F5F3F0');c.save();c.beginPath();c.rect(x,y,cellW,cellH);c.clip();
   if(imgs.logo){let im=imgs.logo,iw=im.naturalWidth,ih=im.naturalHeight;
    let ratio=Math.min(285/iw,145/ih),w=iw*ratio,h=ih*ratio,px=x+(cellW-w)/2,py=y+(cellH-h)/2;
    if(it.kind==='stretch'){c.drawImage(im,x+27,y+86,cellW-54,53)}
    if(it.kind==='rotate'){c.translate(x+cellW/2,y+cellH/2);c.rotate(-.27);c.drawImage(im,-w/2,-h/2,w,h)}
    if(it.kind==='recolor'){c.drawImage(im,px,py,w,h);c.globalCompositeOperation='source-in';fill(c,x,y,cellW,cellH,'#33B9A2');c.globalCompositeOperation='source-over'}
    if(it.kind==='shadow'){c.shadowColor='#111';c.shadowBlur=15;c.shadowOffsetX=13;c.shadowOffsetY=12;c.drawImage(im,px,py,w,h)}
    if(it.kind==='crop'){c.drawImage(im,x+cellW*.65,y+60,w,h)}
    if(it.kind==='contrast'){fill(c,x,y,cellW,cellH,S.primary);c.drawImage(im,px,py,w,h);c.globalCompositeOperation='source-in';fill(c,x,y,cellW,cellH,S.primary);c.globalCompositeOperation='source-over'}
   }else txt(c,'Carregar logótipo',x+50,y+125,20,'#777');
   c.restore();txt(c,'× '+it.name,x+10,y+cellH+29,16,S.primary,'Arial','bold',cellW-15);
  });
  caption(c,'Exemplos de utilizações proibidas. Preservar sempre o desenho original.',1215);
 }
 c.restore();
};

// V4 mockup library: templates are flat visual compositions, not photorealistic renders.
const mockupLibraryV4={items:[],base:''};
function libraryBase(u){return new URL('.',u).href}
async function loadLibraryV4(){
 const status=$('libraryStatus'),url=$('mockupManifest').value.trim()||new URL('mockups/manifest.json',location.href).href;
 try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);
 const j=await r.json();if(!Array.isArray(j.mockups))throw Error('Falta a lista mockups');
 mockupLibraryV4.items=j.mockups.filter(m=>m&&typeof m.name==='string'&&typeof m.image==='string'&&['stationery','social','campaign','photo'].includes(m.category)&&m.placement&&[m.placement.x,m.placement.y,m.placement.w,m.placement.h].every(v=>typeof v==='number'&&v>=0&&v<=1));
 mockupLibraryV4.base=libraryBase(url);status.replaceChildren();
 const grid=document.createElement('div');grid.className='library-grid';
 for(const m of mockupLibraryV4.items){const card=document.createElement('div'),im=document.createElement('img'),b=document.createElement('button');
 im.src=new URL(m.image,mockupLibraryV4.base).href;im.alt=m.name;im.loading='lazy';
 const title=document.createElement('div');title.textContent=m.name;
 b.textContent='Aplicar ao projeto';b.type='button';b.onclick=()=>applyLibraryMockupV4(m,b);
 card.append(im,title,b);grid.append(card)}status.append(grid);
 if(!mockupLibraryV4.items.length)status.textContent='Sem templates válidos no manifesto.';
 }catch(e){status.textContent='Erro na biblioteca: '+e.message}
}
async function applyLibraryMockupV4(m,b){
 const original=b.textContent;b.disabled=true;b.textContent='A gerar...';
 try{
 const url=new URL(m.image,mockupLibraryV4.base).href;
 const response=await fetch(url);if(!response.ok)throw Error('Imagem HTTP '+response.status);
 const blob=await response.blob();const data=await new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(blob)});
 const base=new Image();await new Promise((res,rej)=>{base.onload=res;base.onerror=rej;base.src=data});
 const cv=document.createElement('canvas');cv.width=base.naturalWidth;cv.height=base.naturalHeight;
 const q=cv.getContext('2d');q.drawImage(base,0,0);
 const {x,y,w,h}=m.placement,px=x*cv.width,py=y*cv.height,pw=w*cv.width,ph=h*cv.height;
 if(imgs.logo){const im=imgs.logo,pad=Math.min(pw,ph)*.09,scale=Math.min((pw-pad*2)/im.naturalWidth,(ph-pad*2)/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
 q.drawImage(im,px+(pw-dw)/2,py+(ph-dh)/2,dw,dh)}else throw Error('Carrega primeiro o logótipo');
 const result=cv.toDataURL('image/png');S.assets[m.category]={data:result,name:'mockup-'+filenameSafe(m.name)+'.png'};
 await imageFromData(m.category,result);render();b.textContent='Aplicado ✓';
 }catch(e){alert('Não foi possível aplicar o mockup: '+e.message);b.textContent=original}finally{b.disabled=false}
}
$('loadLibrary').onclick=loadLibraryV4;
$('mockupManifest').placeholder='Biblioteca incluída automaticamente · ou URL do teu GitHub';
loadLibraryV4();



// V5 — per-mockup 2D / perspective editor; safe text boundaries.
(function(){
 const limits={essence:420,personality:260,concept:520,tagline:100,credits:90};
 Object.entries(limits).forEach(([id,max])=>{
  const el=$(id);if(!el)return;el.maxLength=max;
  const counter=document.createElement('small');counter.className='v5-counter';
  el.insertAdjacentElement('afterend',counter);
  const update=()=>{counter.textContent=`${el.value.length} / ${max} caracteres`;counter.style.color=el.value.length>max*.9?'#c61b3c':''};
  el.addEventListener('input',update);update();
 });
 const css=document.createElement('style');css.textContent=`
 .v5-counter{display:block;margin:5px 0 10px;font-size:11px;opacity:.75}
 .v5-editor{margin:18px 0;padding:16px;border:1px solid #bbb6b0;border-radius:9px;max-width:760px}
 .v5-editor label{display:flex;flex-direction:column;gap:6px;font-weight:600;margin:8px 0}
 .v5-editor select,.v5-editor input{padding:8px;border:1px solid #aaa;border-radius:5px;background:transparent;color:inherit}
 .v5-editor canvas{width:100%;height:auto;touch-action:none;cursor:crosshair;background:#ddd;display:block;border-radius:5px}
 .v5-editor .v5-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
 .v5-editor .v5-note{font-size:12px;opacity:.8;margin:8px 0}
 `;document.head.append(css);
 S.mockupPlacements=S.mockupPlacements||{};
 let editor=null;
 function getConfig(m){const id=m.id||m.image;const p=m.placement;
  return S.mockupPlacements[id]||(S.mockupPlacements[id]={mode:'flat',quad:[{x:p.x,y:p.y},{x:p.x+p.w,y:p.y},{x:p.x+p.w,y:p.y+p.h},{x:p.x,y:p.y+p.h}]});
 }
 function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
 function renderComposite(base,logoImage,quad,mode){
  const cv=makeCanvas(base.naturalWidth,base.naturalHeight),q=cv.getContext('2d');q.drawImage(base,0,0);
  if(!logoImage)return cv;
  const W=cv.width,H=cv.height,points=quad.map(p=>({x:p.x*W,y:p.y*H}));
  const texture=makeCanvas(600,360),t=texture.getContext('2d');
  const scale=Math.min(550/logoImage.naturalWidth,310/logoImage.naturalHeight);
  const lw=logoImage.naturalWidth*scale,lh=logoImage.naturalHeight*scale;
  t.drawImage(logoImage,(600-lw)/2,(360-lh)/2,lw,lh);
  if(mode==='flat'){
   const x=points[0].x,y=points[0].y,w=points[1].x-x,h=points[3].y-y;
   q.drawImage(texture,x,y,Math.max(1,w),Math.max(1,h));return cv;
  }
  // Bilinear mesh approximation: each tile is mapped by two affine triangles.
  function interp(u,v){const [a,b,c,d]=points;return {x:(1-u)*(1-v)*a.x+u*(1-v)*b.x+u*v*c.x+(1-u)*v*d.x,y:(1-u)*(1-v)*a.y+u*(1-v)*b.y+u*v*c.y+(1-u)*v*d.y}}
  function tri(src,dst){const [s0,s1,s2]=src,[d0,d1,d2]=dst;
   const det=(s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y));if(Math.abs(det)<.00001)return;
   const a=(d0.x*(s1.y-s2.y)+d1.x*(s2.y-s0.y)+d2.x*(s0.y-s1.y))/det;
   const b=(d0.y*(s1.y-s2.y)+d1.y*(s2.y-s0.y)+d2.y*(s0.y-s1.y))/det;
   const c=(d0.x*(s2.x-s1.x)+d1.x*(s0.x-s2.x)+d2.x*(s1.x-s0.x))/det;
   const d=(d0.y*(s2.x-s1.x)+d1.y*(s0.x-s2.x)+d2.y*(s1.x-s0.x))/det;
   const e=(d0.x*(s1.x*s2.y-s2.x*s1.y)+d1.x*(s2.x*s0.y-s0.x*s2.y)+d2.x*(s0.x*s1.y-s1.x*s0.y))/det;
   const f=(d0.y*(s1.x*s2.y-s2.x*s1.y)+d1.y*(s2.x*s0.y-s0.x*s2.y)+d2.y*(s0.x*s1.y-s1.x*s0.y))/det;
   q.save();q.beginPath();q.moveTo(d0.x,d0.y);q.lineTo(d1.x,d1.y);q.lineTo(d2.x,d2.y);q.closePath();q.clip();q.transform(a,b,c,d,e,f);q.drawImage(texture,0,0);q.restore();
  }
  const N=12;
  for(let iy=0;iy<N;iy++)for(let ix=0;ix<N;ix++){
   const u=ix/N,v=iy/N,U=(ix+1)/N,V=(iy+1)/N;
   const s0={x:u*600,y:v*360},s1={x:U*600,y:v*360},s2={x:U*600,y:V*360},s3={x:u*600,y:V*360};
   const p0=interp(u,v),p1=interp(U,v),p2=interp(U,V),p3=interp(u,V);
   tri([s0,s1,s2],[p0,p1,p2]);tri([s0,s2,s3],[p0,p2,p3]);
  }
  return cv;
 }
 function openEditor(m){
  if(editor)editor.remove();
  const cfg=getConfig(m),url=new URL(m.image,mockupLibraryV4.base).href;
  const root=$('libraryStatus');editor=document.createElement('section');editor.className='v5-editor';
  const h=document.createElement('h3');h.textContent='Editor de mockup — '+m.name;
  const mode=document.createElement('select');mode.innerHTML='<option value="flat">2D · sobreposição plana</option><option value="perspective">Perspetiva · ajustar 4 cantos</option>';mode.value=cfg.mode;
  const labelMode=document.createElement('label');labelMode.textContent='Método de aplicação';labelMode.append(mode);
  const preview=makeCanvas(760,480);const note=document.createElement('p');note.className='v5-note';note.textContent='Arrasta os quatro pontos vermelhos para posicionar o logótipo. Em perspetiva, adapta os cantos à superfície do objeto.';
  const actions=document.createElement('div');actions.className='v5-actions';
  const apply=document.createElement('button');apply.textContent='Aplicar ao projeto';apply.type='button';
  const reset=document.createElement('button');reset.textContent='Repor posição';reset.type='button';
  const close=document.createElement('button');close.textContent='Fechar editor';close.type='button';
  actions.append(apply,reset,close);editor.append(h,labelMode,note,preview,actions);root.prepend(editor);
  let base=null,drag=-1;
  function draw(){if(!base)return;const q=preview.getContext('2d');q.clearRect(0,0,preview.width,preview.height);
   const composite=renderComposite(base,imgs.logo,cfg.quad,cfg.mode);
   const scale=Math.min(preview.width/base.width,preview.height/base.height),w=base.width*scale,h=base.height*scale,ox=(preview.width-w)/2,oy=(preview.height-h)/2;
   q.drawImage(composite,ox,oy,w,h);q.save();q.strokeStyle='#E21C45';q.lineWidth=2;q.beginPath();cfg.quad.forEach((p,i)=>{const x=ox+p.x*w,y=oy+p.y*h;i?q.lineTo(x,y):q.moveTo(x,y)});q.closePath();q.stroke();cfg.quad.forEach((p,i)=>{const x=ox+p.x*w,y=oy+p.y*h;q.beginPath();q.arc(x,y,7,0,Math.PI*2);q.fillStyle='#E21C45';q.fill();q.strokeStyle='#fff';q.stroke()});q.restore();
  }
  const image=new Image();image.onload=()=>{base=image;draw()};image.onerror=()=>{note.textContent='Não foi possível carregar a imagem. Confirma o caminho e o acesso CORS no GitHub.'};image.crossOrigin='anonymous';image.src=url;
  function coord(e){const r=preview.getBoundingClientRect(),px=(e.clientX-r.left)*preview.width/r.width,py=(e.clientY-r.top)*preview.height/r.height;
   if(!base)return null;const sc=Math.min(preview.width/base.width,preview.height/base.height),w=base.width*sc,h=base.height*sc;return {x:(px-(preview.width-w)/2)/w,y:(py-(preview.height-h)/2)/h};
  }
  preview.addEventListener('pointerdown',e=>{const p=coord(e);if(!p)return;let best=Infinity;cfg.quad.forEach((v,i)=>{let d=Math.hypot((v.x-p.x)*preview.width,(v.y-p.y)*preview.height);if(d<best){best=d;drag=i}});if(best>85){drag=-1;return}preview.setPointerCapture(e.pointerId)});
  preview.addEventListener('pointermove',e=>{if(drag<0)return;const p=coord(e);if(!p)return;cfg.quad[drag]={x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))};draw()});
  preview.addEventListener('pointerup',()=>drag=-1);preview.addEventListener('pointercancel',()=>drag=-1);
  mode.onchange=()=>{cfg.mode=mode.value;draw()};reset.onclick=()=>{const p=m.placement;cfg.quad=[{x:p.x,y:p.y},{x:p.x+p.w,y:p.y},{x:p.x+p.w,y:p.y+p.h},{x:p.x,y:p.y+p.h}];draw()};close.onclick=()=>{editor.remove();editor=null};
  apply.onclick=async()=>{if(!base||!imgs.logo){alert('Carrega primeiro o logótipo e aguarda a imagem do mockup.');return}
   try{apply.disabled=true;const result=renderComposite(base,imgs.logo,cfg.quad,cfg.mode).toDataURL('image/png');
    S.assets[m.category]={data:result,name:'mockup-'+filenameSafe(m.name)+'.png'};await imageFromData(m.category,result);render();note.textContent='Aplicado! A imagem está no Brand Board e no PDF. Guarda o projeto JSON para manter esta escolha.';
   }catch(e){alert('Erro ao aplicar: '+e.message)}finally{apply.disabled=false}
  };
 }
 // Replace the old immediate-apply behavior with the new per-item editor.
 applyLibraryMockupV4=async function(m){openEditor(m)};
 // Ensure the selected mockup geometry persists in saved JSON.
 // hydrate already restores S.mockupPlacements from project JSON.
 // Explicit overflow control in paragraph renderer: no text outside its reserved box.
 para=function(c,s,x,y,maxWidth=740,size=24,lineHeight=37,color='#222',font='Arial',maxLines=8){
  c.save();c.font=`${size}px ${font}`;c.fillStyle=color;c.textBaseline='alphabetic';
  const words=String(s||'').trim().split(/\s+/).filter(Boolean),lines=[];let row='';
  for(const word of words){let part=word;while(c.measureText(part).width>maxWidth&&part.length>1){let cut=part.length-1;while(cut>1&&c.measureText(part.slice(0,cut)+'-').width>maxWidth)cut--;const piece=part.slice(0,cut)+'-';if(row){lines.push(row);row=''}lines.push(piece);part=part.slice(cut)}
   const test=row?row+' '+part:part;if(c.measureText(test).width>maxWidth&&row){lines.push(row);row=part}else row=test;
  }if(row)lines.push(row);
  const truncated=lines.length>maxLines;const visible=lines.slice(0,maxLines);
  if(truncated&&visible.length){let last=visible.length-1;while(visible[last].length>1&&c.measureText(visible[last]+'…').width>maxWidth)visible[last]=visible[last].slice(0,-1);visible[last]+='…'}
  visible.forEach((str,i)=>c.fillText(str,x,y+i*lineHeight));c.restore();return visible.length;
 };
})();
