export const CLASSES = {
 mage: {name:'Mago',role:'Controle à distância',hp:100,speed:115,color:'#9fc7ff',description:'Combina explosões, lentidão e um raio que mira o rival mais próximo.',abilities:[
  {name:'Bola de fogo',hint:'EXPLOSÃO',cooldown:.7,kind:'fire',damage:28},
  {name:'Lança de gelo',hint:'LENTIDÃO',cooldown:1.5,kind:'ice',damage:20},
  {name:'Relâmpago',hint:'ÁREA',cooldown:4,kind:'bolt',damage:46}]},
 knight: {name:'Cavaleiro',role:'Resistência e combate próximo',hp:130,speed:95,color:'#f3cc8d',description:'Mais vida. Aproxime-se com a investida e acerte espada e impacto no chão.',abilities:[
  {name:'Corte de aço',hint:'CORPO A CORPO',cooldown:.65,kind:'slash',damage:32,range:57},
  {name:'Investida',hint:'AVANÇO + GOLPE',cooldown:2.2,kind:'charge',damage:30,range:78,duration:.32},
  {name:'Abalo sísmico',hint:'ÁREA PRÓXIMA',cooldown:4.5,kind:'quake',damage:48,range:82}]},
 rogue: {name:'Assassino',role:'Velocidade e precisão',hp:80,speed:145,color:'#8dedcc',description:'Menos vida, mais velocidade. Lance adagas, esquive e finalize pelas costas.',abilities:[
  {name:'Adaga voadora',hint:'PROJÉTIL RÁPIDO',cooldown:.6,kind:'dagger',damage:24},
  {name:'Passo sombrio',hint:'ESQUIVA · SEM DANO',cooldown:2,kind:'dash',damage:0,range:105,duration:.26},
  {name:'Golpe furtivo',hint:'BÔNUS PELAS COSTAS',cooldown:3,kind:'backstab',damage:42,range:62}]}
};
export const MAPS = {
 abbey:{name:'Abadia da Lua',description:'Arcos em ruínas, névoa e tochas sob a lua.',color:'#9fbabc'},
 volcano:{name:'Forja Vulcânica',description:'Lava, correntes e brasas na fortaleza de obsidiana.',color:'#ffaf75'},
 forest:{name:'Floresta das Runas',description:'Árvores antigas, cristais e vaga-lumes encantados.',color:'#96ebba'},
 glacier:{name:'Cidadela Glacial',description:'Torres de gelo, aurora e neve sobre a ponte.',color:'#a1ddff'}
};
export const classOf=id=>CLASSES[Object.hasOwn(CLASSES,id)?id:'mage'];

export function motionAt(burst,elapsed=burst.elapsed){const t=Math.max(0,Math.min(1,elapsed/burst.duration));const eased=t*t*(3-2*t);return burst.from+(burst.to-burst.from)*eased;}
