/* Configuração Playwright — ClinicNow
   Os arquivos são estáticos: servimos o repositório inteiro com
   `python3 -m http.server` e navegamos em /clinicnow/. O Chromium do
   ambiente fica em /opt/pw-browsers (não rodar "playwright install"). */
const { defineConfig } = require('@playwright/test');
const path = require('path');

const PORT = 8199;
const REPO = path.resolve(__dirname, '..', '..');

module.exports = defineConfig({
  testDir: __dirname,
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}/clinicnow/`,
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium',
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: `python3 -m http.server ${PORT} --directory "${REPO}"`,
    url: `http://127.0.0.1:${PORT}/clinicnow/index.html`,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
