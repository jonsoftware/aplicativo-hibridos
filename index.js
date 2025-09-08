/**
 * AULA 1 - ARQUIVO PRINCIPAL
 * 
 * Este é o arquivo principal da Aula 1. Ele demonstra:
 * - Como importar módulos em Node.js
 * - Como configurar um servidor HTTP básico
 * - Como conectar com MongoDB
 * - Conceitos fundamentais de aplicativos híbridos
 */

// Importação de módulos nativos do Node.js
const http = require('http');           // Módulo para criar servidor HTTP
const url = require('url');             // Módulo para parsing de URLs
const querystring = require('querystring'); // Módulo para parsing de query strings

// Importação de módulos externos (instalados via npm)
const express = require('express');     // Framework web para Node.js
const cors = require('cors');           // Middleware para habilitar CORS

// Importação de nossos próprios módulos
const { connectToDatabase, getConnectionStatus, testConnection } = require('./config/database');

/**
 * CONFIGURAÇÃO DO SERVIDOR
 * ========================
 * 
 * Aqui definimos as configurações básicas do nosso servidor:
 * - Porta onde o servidor vai rodar
 * - Configurações do Express
 * - Middleware básico
 */

// Porta do servidor (usa variável de ambiente ou padrão 3000)
const PORT = process.env.PORT || 3000;

// Criação da instância do Express
const app = express();

// Configuração de middleware básico
app.use(cors());                        // Habilita CORS para requisições cross-origin
app.use(express.json());                // Permite parsing de JSON nas requisições
app.use(express.urlencoded({ extended: true })); // Permite parsing de dados de formulário

/**
 * ROTAS BÁSICAS
 * =============
 * 
 * Estas são as rotas mais básicas que nossa aplicação terá.
 * Elas demonstram conceitos fundamentais de roteamento web.
 */

// ROTA RAIZ - Página inicial
app.get('/', async (req, res) => {
    console.log('🏠 Acessando página inicial...');

    // Obtém informações dinâmicas do sistema
    const systemInfo = {
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        timestamp: new Date().toLocaleString('pt-BR')
    };

    // Testa conexão com banco de dados
    const dbStatus = getConnectionStatus();
    const isDbConnected = await testConnection();

    // Resposta HTML melhorada
    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aplicativo Híbrido - Aula 1</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    padding: 20px;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(15px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    font-size: 3rem;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                .header p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }
                .card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 25px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: transform 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                }
                .card h3 {
                    font-size: 1.4rem;
                    margin-bottom: 15px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .status-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .status-item:last-child {
                    border-bottom: none;
                }
                .status-value {
                    font-weight: bold;
                }
                .success { color: #4ade80; }
                .error { color: #f87171; }
                .warning { color: #fbbf24; }
                .info { color: #fff; }
                .routes {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }
                .route-item {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }
                .route-item:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
                .route-item a {
                    color: #fff;
                    text-decoration: none;
                    font-weight: bold;
                }
                .route-item a:hover {
                    color: #fff;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    opacity: 0.8;
                }
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                    overflow: hidden;
                    margin: 10px 0;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4ade80, #22c55e);
                    width: 100%;
                    animation: progress 2s ease-in-out;
                }
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Aplicativo Híbrido - Aula 1</h1>
                    <p>Bem-vindo ao nosso aplicativo híbrido de gerenciamento de tarefas!</p>
                </div>
                
                <div class="grid">
                    <div class="card">
                        <h3>📊 Status do Sistema</h3>
                        <div class="status-item">
                            <span>Servidor:</span>
                            <span class="status-value success">✅ Rodando na porta ${PORT}</span>
                        </div>
                        <div class="status-item">
                            <span>Banco de dados:</span>
                            <span class="status-value ${isDbConnected ? 'success' : 'error'}">
                                ${isDbConnected ? '✅ Conectado' : '❌ Desconectado'}
                            </span>
                        </div>
                        <div class="status-item">
                            <span>Status da conexão:</span>
                            <span class="status-value info">${dbStatus.status}</span>
                        </div>
                        <div class="status-item">
                            <span>Uptime:</span>
                            <span class="status-value info">${Math.floor(systemInfo.uptime / 60)}m ${systemInfo.uptime % 60}s</span>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>💻 Informações do Sistema</h3>
                        <div class="status-item">
                            <span>Node.js:</span>
                            <span class="status-value info">${systemInfo.nodeVersion}</span>
                        </div>
                        <div class="status-item">
                            <span>Plataforma:</span>
                            <span class="status-value info">${systemInfo.platform}</span>
                        </div>
                        <div class="status-item">
                            <span>Memória usada:</span>
                            <span class="status-value info">${Math.round(systemInfo.memory.heapUsed / 1024 / 1024)} MB</span>
                        </div>
                        <div class="status-item">
                            <span>Última atualização:</span>
                            <span class="status-value info">${systemInfo.timestamp}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>🎯 Objetivos da Aula 1</h3>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span class="success">✅</span> Configurar ambiente de desenvolvimento
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span class="success">✅</span> Entender conceitos de aplicativos híbridos
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span class="success">✅</span> Criar estrutura básica do projeto
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span class="success">✅</span> Conectar com MongoDB
                        </li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>🔗 Rotas Disponíveis</h3>
                    <div class="routes">
                        <div class="route-item">
                            <a href="/">🏠 Página inicial</a>
                            <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Interface principal do sistema</p>
                        </div>
                        <div class="route-item">
                            <a href="/api/status">📊 Status da API</a>
                            <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Informações detalhadas da API</p>
                        </div>
                        <div class="route-item">
                            <a href="/api/database">🗄️ Status do banco</a>
                            <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Status da conexão com MongoDB</p>
                        </div>
                        <div class="route-item">
                            <a href="/api/test" onclick="testPost()">🧪 Teste POST</a>
                            <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Testar requisições POST</p>
                        </div>
                        <div class="route-item">
                            <a href="/login">🔐 Página de Login</a>
                            <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Acessar formulário de autenticação</p>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🚀 Aplicativo Híbrido - Aula 1 | Desenvolvido para fins educacionais</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">
                        Sistema rodando desde ${new Date(systemInfo.timestamp).toLocaleString('pt-BR')}
                    </p>
                </div>
            </div>
            
            <script>
                function testPost() {
                    fetch('/api/test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: 'Teste da interface',
                            timestamp: new Date().toISOString()
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Teste POST executado com sucesso!\\n\\nResposta: ' + JSON.stringify(data, null, 2));
                    })
                    .catch(error => {
                        alert('Erro no teste POST: ' + error.message);
                    });
                }
                
                // Atualiza informações a cada 30 segundos
                setInterval(() => {
                    location.reload();
                }, 30000);
            </script>
        </body>
        </html>
    `;

    res.send(html);
});

// ROTA PARA PÁGINA DE SUCESSO
app.get('/successo.html', (req, res) => {
    console.log('✅ Acessando página de sucesso...');
    
    const path = require('path');
    const fs = require('fs');
    
    try {
        const successPage = fs.readFileSync(path.join(__dirname, 'templates', 'successo.html'), 'utf8');
        res.send(successPage);
    } catch (error) {
        console.error('Erro ao carregar página de sucesso:', error);
        res.status(500).send('Página de sucesso não disponível');
    }
});

// =============================================================================
// ROTAS DE LOGIN (MOVa ESTAS LINHAS PARA ANTES DOS MIDDLEWARES DE ERRO)
// =============================================================================

// ROTA DE LOGIN - Página do formulário
app.get('/login', (req, res) => {
    console.log('🔐 Acessando página de login...');

    // Lê e envia o arquivo HTML de login
    const path = require('path');
    const fs = require('fs');

    try {
        const loginPage = fs.readFileSync(path.join(__dirname, 'templates', 'index.html'), 'utf8');
        res.send(loginPage);
    } catch (error) {
        console.error('Erro ao carregar página de login:', error);
        res.status(500).send('Página de login não disponível no momento');
    }
});

// ROTA PARA PROCESSAR LOGIN (quando o formulário é enviado)
app.post('/login', (req, res) => {
    console.log('🔐 Processando tentativa de login...');
    console.log('Dados recebidos:', req.body);
    
    // Aqui você normalmente validaria as credenciais
    const { email, password } = req.body;
    
    // Verificação básica (apenas para exemplo)
    if (email && password) {
        // Redireciona para página de sucesso
        res.redirect('/sucesso.html');
    } else {
        // Se faltarem dados, mostra erro
        res.status(400).send('Email e senha são obrigatórios');
    }
});

// ROTA PARA PÁGINA DE SUCESSO
app.get('/sucesso.html', (req, res) => {
    console.log('✅ Acessando página de sucesso...');
    
    const path = require('path');
    const fs = require('fs');
    
    try {
        const successPage = fs.readFileSync(path.join(__dirname, 'templates', 'sucesso.html'), 'utf8');
        res.send(successPage);
    } catch (error) {
        console.error('Erro ao carregar página de sucesso:', error);
        res.status(500).send('Página de sucesso não disponível');
    }
});

// =============================================================================
// MIDDLEWARE PARA SERVIR ARQUIVOS ESTÁTICOS (mantenha esta linha)
// =============================================================================
app.use(express.static('templates'));

// =============================================================================
// SUAS OUTRAS ROTAS EXISTENTES (mantenha-as aqui)
// =============================================================================
// ROTA DE STATUS DA API
app.get('/api/status', (req, res) => {
    // ... seu código existente
});

// ROTA DE STATUS DO BANCO DE DADOS
app.get('/api/database', async (req, res) => {
    // ... seu código existente
});

// ROTA DE TESTE
app.post('/api/test', (req, res) => {
    // ... seu código existente
});

// =============================================================================
// MIDDLEWARE DE TRATAMENTO DE ERROS (estes devem ficar por último)
// =============================================================================
// Este middleware captura erros não tratados e retorna uma resposta padronizada
app.use((error, req, res, next) => {
    // ... seu código existente
});

// MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (este deve ser o último)
app.use('*', (req, res) => {
    // ... seu código existente
});

app.use(express.static('templates'));

// ROTA DE STATUS DA API
app.get('/api/status', (req, res) => {
    console.log('📊 Verificando status da API...');

    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform,
        port: PORT
    };

    res.json(status);
});

// ROTA DE STATUS DO BANCO DE DADOS
app.get('/api/database', async (req, res) => {
    console.log('🗄️ Verificando status do banco de dados...');

    try {
        const connectionStatus = getConnectionStatus();
        const isConnected = await testConnection();

        const databaseStatus = {
            connection: connectionStatus,
            isConnected: isConnected,
            timestamp: new Date().toISOString()
        };

        res.json(databaseStatus);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao verificar banco de dados',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ROTA DE TESTE (para demonstrar diferentes métodos HTTP)
app.post('/api/test', (req, res) => {
    console.log('🧪 Teste POST recebido...');
    console.log('Dados recebidos:', req.body);

    res.json({
        message: 'Teste POST executado com sucesso!',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

// MIDDLEWARE DE TRATAMENTO DE ERROS
// =================================
// Este middleware captura erros não tratados e retorna uma resposta padronizada
app.use((error, req, res, next) => {
    console.error('💥 Erro não tratado:', error);

    res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS
// =====================================
// Este middleware retorna 404 para rotas que não existem
app.use('*', (req, res) => {
    console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);

    res.status(404).json({
        error: 'Rota não encontrada',
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// ROTA DE LOGIN
app.get('/login', (req, res) => {
    console.log('🔐 Acessando página de login...');

    // Lê e envia o arquivo HTML de login
    const path = require('path');
    const fs = require('fs');

    try {
        const loginPage = fs.readFileSync(path.join(__dirname, 'templates', 'index.html'), 'utf8');
        res.send(loginPage);
    } catch (error) {
        console.error('Erro ao carregar página de login:', error);
        res.status(500).send('Página de login não disponível no momento');
    }
});
/**
 * INICIALIZAÇÃO DO SERVIDOR
 * =========================
 * 
 * Esta função inicializa o servidor e conecta com o banco de dados.
 * Ela é executada quando o arquivo é carregado.
 */
const startServer = async () => {
    try {
        console.log('🚀 Iniciando aplicativo híbrido...');
        console.log('='.repeat(50));

        // Tenta conectar com o banco de dados (opcional)
        const dbConnected = await connectToDatabase();

        // Inicia o servidor independentemente da conexão com o banco
        app.listen(PORT, () => {
            console.log('✅ Servidor iniciado com sucesso!');
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📱 API: http://localhost:${PORT}/api/status`);
            if (dbConnected) {
                console.log('🗄️  Banco de dados: Conectado');
            } else {
                console.log('⚠️  Banco de dados: Não disponível (modo offline)');
            }
            console.log('📝 Logs das requisições aparecerão abaixo:');
            console.log('='.repeat(50));
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

// Executa a inicialização do servidor
startServer();

/**
 * CONCEITOS IMPORTANTES DEMONSTRADOS NESTA AULA:
 * ==============================================
 * 
 * 1. **Módulos Node.js**: Como importar e usar módulos nativos e externos
 * 2. **Servidor HTTP**: Criação de servidor web básico
 * 3. **Express.js**: Framework que facilita criação de APIs
 * 4. **Middleware**: Funções que executam entre requisição e resposta
 * 5. **Roteamento**: Como definir rotas para diferentes URLs
 * 6. **Tratamento de erros**: Como capturar e tratar erros
 * 7. **Conexão com banco**: Como conectar com MongoDB
 * 8. **Aplicativos híbridos**: Conceito de aplicações web que funcionam como apps nativos
 * 
 * PRÓXIMA AULA:
 * =============
 * Na Aula 2, vamos aprofundar no Express.js e criar um servidor mais robusto
 * com funcionalidades avançadas de roteamento e middleware.
 */
