# PvP em tempo real

O processo Node mantém salas para até três jogadores na memória, simula o combate a 60 passos por segundo e envia o estado por WebSocket 20 vezes por segundo. O navegador envia controles 30 vezes por segundo e responde ao movimento local imediatamente. Vida, dano e placar são calculados pelo servidor.

## Rodar

`npm ci` e `npm start`. Abra `http://localhost:4181/pvp.html`. O Render fornece a porta pela variável `PORT`. A rota `/health` retorna o estado do serviço.

## Publicar

Use `render.yaml` ou crie um Web Service Node, plano **Free**, região Virginia, comando de build `npm ci --omit=dev`, comando de início `npm start`. Defina `ALLOWED_ORIGINS` com o endereço do site. Não é necessário banco de dados nem serviço pago.

O site do Render já pode servir o jogo completo. Para manter o endereço no Sites, configure `public/realtime-config.js` com o endereço HTTPS retornado pelo Render, faça o build e publique a nova versão do Sites.

Salas são temporárias: reiniciar ou republicar o servidor encerra partidas. Conexões perdidas podem voltar por 60 segundos. O plano gratuito pode adormecer depois de 15 minutos sem tráfego; a primeira conexão pode demorar enquanto ele acorda. Não há garantia de latência, e a região americana acrescenta distância aos jogadores brasileiros.

## Verificação

- `node scripts/test-engine.mjs`: dano, eliminações, renascimento e revanche.
- `npm run test:realtime`: três jogadores, limite de sala, comandos, autenticação, sincronização e reconexão.
- `scripts/test-browser.mjs`: três navegadores, movimento, ataques, recarregamento e layout móvel. Usa o Playwright instalado no estúdio local.

Arte de efeitos PixelFX sob MIT, com licença preservada em `public/vendor/pixelfx/LICENSE`.
