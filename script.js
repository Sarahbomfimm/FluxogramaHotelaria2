// ============================================
// DADOS DO FLUXOGRAMA
// ============================================
const flowData = [
    {
        id: 1,
        title: "Identificação da Necessidade",
        responsible: "Responsável do setor",
        type: "manutencao",
        summary: "Demanda de manutenção identificada e requisição aberta",
        details: [
            "Demanda de manutenção (corretiva ou preventiva) é identificada",
            "Abertura de Requisição de Serviço contendo:",
            "• Descrição detalhada do problema",
            "• Nível de urgência (crítico, alto, médio, baixo)",
            "• Local exato da ocorrência",
            "• Tipo de serviço necessário",
            "• Exposição clara da necessidade"
        ]
    },
    {
        id: 2,
        title: "Avaliação Técnica e Cotação",
        responsible: "Setor de Controller",
        type: "controller",
        summary: "Vistoria realizada e cotações solicitadas",
        details: [
            "Realiza vistoria técnica",
            "Define a necessidade real do serviço",
            "Solicita cotações de pelo menos 2 a 3 fornecedores/prestadores cadastrados",
            "Compara propostas considerando custo-benefício",
            "Anexa as cotações na Requisição de Serviço",
            "Elabora justificativa técnica detalhada"
        ]
    },
    {
        id: 3,
        title: "Aprovação de Orçamento",
        responsible: "Controller",
        type: "controller",
        summary: "Análise orçamentária e aprovação financeira",
        details: [
            "Verifica se o serviço está previsto no orçamento anual",
            "Valida o centro de custo correto",
            "Avalia conformidade com políticas internas da empresa",
            "Calcula e analisa o Pay Back do investimento",
            "Avalia URGÊNCIA do serviço caso esteja fora do escopo",
            "Se aprovado, encaminha ao setor Financeiro"
        ]
    },
    {
        id: 4,
        title: "Liberação de Pagamento",
        responsible: "Financeiro",
        type: "financeiro",
        summary: "Processamento e liberação do pagamento",
        details: [
            "Avalia a modalidade de pagamento solicitada:",
            "• Pagamento antecipado (sinal)",
            "• Pagamento parcial mediante entrega do serviço e medição",
            "• Pagamento somente após conclusão do serviço",
            "Realiza pagamento de adiantamento conforme política da empresa",
            "Emite autorização formal para execução do serviço",
            "Registra a transação no sistema financeiro"
        ]
    },
    {
        id: 5,
        title: "Execução do Serviço",
        responsible: "Fornecedor / Prestador de Serviço",
        type: "prestador",
        summary: "Prestador executa o serviço conforme escopo",
        details: [
            "Executa o serviço conforme escopo acordado"
        ]
    },
    {
        id: 6,
        title: "Atesto de Serviço Executado",
        responsible: "Responsável do Setor",
        type: "manutencao",
        summary: "Validação técnica do serviço realizado",
        details: [
            "Após finalização, emite o Atesto de Serviço Executado confirmando:",
            "• Execução conforme solicitado no escopo",
            "• Qualidade aceitável do serviço prestado",
            "• Funcionamento adequado do equipamento/estrutura",
            "Anexa documentação:",
            "• Fotos do serviço concluído",
            "• Relatório técnico detalhado (se aplicável)",
            "Encaminha toda documentação ao Financeiro"
        ]
    },
    {
        id: 7,
        title: "Pagamento Final",
        responsible: "Financeiro",
        type: "financeiro",
        summary: "Processamento do pagamento final",
        details: [
            "Confere todos os documentos:",
            "• Conformidade com orçamento aprovado",
            "• Documentação fiscal (nota fiscal correta)",
            "• Centro de custo adequado",
            "• Retenções de impostos aplicáveis",
            "Processa pagamento final via sistema bancário ou dinheiro",
            "Armazena e digitaliza comprovantes e nota fiscal",
            "Atualiza registros contábeis no sistema"
        ]
    },
    {
        id: 8,
        title: "Arquivamento e Registro",
        responsible: "Todos os Setores",
        type: "todos",
        summary: "Documentação arquivada para histórico",
        details: [
            "Documentos envolvidos são armazenados digitalmente e/ou fisicamente:",
            "Financeiro responsável por:",
            "• Documentos fiscais e contábeis",
            "• Comprovantes de pagamento",
            "• Notas fiscais",
            "Manutenção responsável por:",
            "• Histórico técnico do equipamento/local",
            "• Relatórios de execução",
            "• Garantias e certificados"
        ]
    }
];

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
let currentView = 'vertical';
let currentZoom = 1;
let selectedNode = null;
let expandedNodeId = null;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeFlowchart();
    initializeControls();
    initializeDetailsPanel();
    window.addEventListener('resize', debounce(handleResize, 250));
});

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

function initializeFlowchart() {
    renderFlowchart();
    setTimeout(() => {
        drawConnections();
    }, 100);
}

function renderFlowchart() {
    const nodesLayer = document.getElementById('nodes-layer');
    nodesLayer.innerHTML = '';
    
    flowData.forEach((node, index) => {
        const nodeElement = createNodeElement(node, index);
        nodesLayer.appendChild(nodeElement);
    });
    
    // Ajustar tamanho do canvas após renderização
    setTimeout(() => {
        adjustCanvasSize();
    }, 50);
}

function createNodeElement(node, index) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = `flow-node ${node.type}`;
    nodeDiv.dataset.nodeId = node.id;
    nodeDiv.dataset.index = index;
    
    // Posicionamento diferente para cada modo
    if (currentView === 'vertical') {
        // No vertical, usar position relative com margin
        nodeDiv.style.position = 'relative';
        nodeDiv.style.marginBottom = '80px';
        nodeDiv.style.left = 'auto';
        nodeDiv.style.top = 'auto';
        nodeDiv.style.transform = 'none';
    } else {
        // No horizontal, usar position absolute
        nodeDiv.style.position = 'absolute';
        nodeDiv.style.position = 'absolute';
        nodeDiv.style.top = '200px'; // Fixo a 200px do topo
        nodeDiv.style.transform = 'translateY(0)';
        nodeDiv.style.left = `${index * 600}px`; // Mais espaço horizontal
        nodeDiv.style.marginBottom = '0';
    }
    
    // Criar HTML do nó com detalhes inline
    const detailsHtml = node.details.map(detail => `<li>${detail}</li>`).join('');
    
    nodeDiv.innerHTML = `
        <div class="node-header">
            <div class="node-number">${node.id}</div>
        </div>
        <div class="node-title">${node.title}</div>
        <div class="node-responsible">${node.responsible}</div>
        <div class="node-summary">${node.summary}</div>
        <div class="node-badge">${node.details.length} detalhes</div>
        <div class="node-details" id="details-${node.id}">
            <ul class="node-details-list">
                ${detailsHtml}
            </ul>
        </div>
    `;
    
    // Animação sequencial
    nodeDiv.style.opacity = '0';
    nodeDiv.style.animation = `fadeIn 0.5s ease-out ${index * 0.15}s forwards`;
    
    // Adicionar evento de clique para expandir/recolher
    nodeDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNodeExpansion(node, nodeDiv);
    });
    
    return nodeDiv;
}

function drawConnections() {
    const svg = document.getElementById('connections-svg');
    svg.innerHTML = '';
    
    const nodes = document.querySelectorAll('.flow-node');
    
    for (let i = 0; i < nodes.length - 1; i++) {
        const node1 = nodes[i];
        const node2 = nodes[i + 1];
        
        const rect1 = node1.getBoundingClientRect();
        const rect2 = node2.getBoundingClientRect();
        const canvasRect = document.getElementById('flowchart-canvas').getBoundingClientRect();
        
        let x1, y1, x2, y2;
        
        if (currentView === 'vertical') {
            x1 = rect1.left - canvasRect.left + rect1.width / 2;
            y1 = rect1.bottom - canvasRect.top;
            x2 = rect2.left - canvasRect.left + rect2.width / 2;
            y2 = rect2.top - canvasRect.top;
        } else {
            x1 = rect1.right - canvasRect.left;
            y1 = rect1.top - canvasRect.top + rect1.height / 2;
            x2 = rect2.left - canvasRect.left;
            y2 = rect2.top - canvasRect.top + rect2.height / 2;
        }
        
        // Criar linha com animação sequencial
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        let d;
        if (currentView === 'vertical') {
            const controlY = (y1 + y2) / 2;
            d = `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${controlY}, ${x2} ${y2}`;
        } else {
            const controlX = (x1 + x2) / 2;
            d = `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('class', 'connection-line');
        
        // Calcular comprimento do path para animação
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        path.style.animation = `drawLine 0.8s ease-out ${i * 0.15 + 0.3}s forwards`;
        
        svg.appendChild(path);
        
        // Criar seta com animação
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const arrowSize = 10;
        
        let points;
        if (currentView === 'vertical') {
            points = `${x2},${y2} ${x2 - arrowSize},${y2 - arrowSize * 1.5} ${x2 + arrowSize},${y2 - arrowSize * 1.5}`;
        } else {
            points = `${x2},${y2} ${x2 - arrowSize * 1.5},${y2 - arrowSize} ${x2 - arrowSize * 1.5},${y2 + arrowSize}`;
        }
        
        arrow.setAttribute('points', points);
        arrow.setAttribute('class', 'connection-arrow');
        arrow.style.opacity = '0';
        arrow.style.animation = `fadeInArrow 0.4s ease-out ${i * 0.15 + 0.8}s forwards`;
        
        svg.appendChild(arrow);
    }
}

function adjustCanvasSize() {
    const canvas = document.getElementById('flowchart-canvas');
    const nodes = document.querySelectorAll('.flow-node');
    
    if (nodes.length === 0) return;
    
    let maxWidth = 0;
    let maxHeight = 0;
    
    nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const right = node.offsetLeft + node.offsetWidth;
        const bottom = node.offsetTop + node.offsetHeight;
        
        maxWidth = Math.max(maxWidth, right);
        maxHeight = Math.max(maxHeight, bottom);
    });
    
    // Adicionar padding extra - maior para garantir que nada seja cortado
    const paddingHorizontal = currentView === 'horizontal' ? 300 : 200;
    const paddingVertical = currentView === 'horizontal' ? 500 : 200;
    
    canvas.style.width = `${maxWidth + paddingHorizontal}px`;
    canvas.style.height = `${maxHeight + paddingVertical}px`;
    
    const svg = document.getElementById('connections-svg');
    svg.setAttribute('width', maxWidth + paddingHorizontal);
    svg.setAttribute('height', maxHeight + paddingVertical);
}

// ============================================
// CONTROLES DE VISUALIZAÇÃO
// ============================================

function initializeControls() {
    // Botões de visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    // Botões de zoom
    document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleZoom(action);
        });
    });
}

function switchView(view) {
    if (view === currentView) return;
    
    currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Recolher todos os nós antes de mudar
    collapseAllNodes();
    
    renderFlowchart();
    setTimeout(() => {
        adjustCanvasSize();
        drawConnections();
    }, 200);
}

function handleZoom(action) {
    const canvas = document.getElementById('flowchart-canvas');
    
    if (action === 'zoom-in') {
        currentZoom = Math.min(currentZoom + 0.1, 2);
    } else if (action === 'zoom-out') {
        currentZoom = Math.max(currentZoom - 0.1, 0.5);
    } else if (action === 'zoom-reset') {
        currentZoom = 1;
    }
    
    canvas.style.transform = `scale(${currentZoom})`;
}

// ============================================
// PAINEL DE DETALHES
// ============================================

function initializeDetailsPanel() {
    const closeBtn = document.getElementById('close-details');
    closeBtn.addEventListener('click', hideDetailsPanel);
    
    // Fechar ao clicar fora (em mobile)
    const panel = document.getElementById('details-panel');
    panel.addEventListener('click', (e) => {
        if (e.target === panel) {
            hideDetailsPanel();
        }
    });
    
    // Fechar ao clicar fora dos nós
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.flow-node')) {
            collapseAllNodes();
        }
    });
}

function toggleNodeExpansion(node, nodeElement) {
    const detailsDiv = document.getElementById(`details-${node.id}`);
    
    // Se já está expandido, recolher
    if (expandedNodeId === node.id) {
        detailsDiv.classList.remove('show');
        nodeElement.classList.remove('expanded');
        expandedNodeId = null;
    } else {
        // Recolher todos os outros nós primeiro
        collapseAllNodes();
        
        // Expandir este nó
        detailsDiv.classList.add('show');
        nodeElement.classList.add('expanded');
        expandedNodeId = node.id;
        
        // Scroll suave até o nó
        setTimeout(() => {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Redesenhar conexões após expansão/colapso
    setTimeout(() => {
        drawConnections();
    }, 100);
}

function collapseAllNodes() {
    document.querySelectorAll('.node-details').forEach(details => {
        details.classList.remove('show');
    });
    document.querySelectorAll('.flow-node').forEach(node => {
        node.classList.remove('expanded');
    });
    expandedNodeId = null;
    
    // Redesenhar conexões
    setTimeout(() => {
        drawConnections();
    }, 100);
}

function showNodeDetails(node) {
    const panel = document.getElementById('details-panel');
    const content = document.getElementById('details-content');
    
    // Remover classe active de todos os nós
    document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active'));
    
    // Adicionar classe active ao nó selecionado
    const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`);
    if (nodeElement) {
        nodeElement.classList.add('active');
    }
    
    selectedNode = node;
    
    // Construir conteúdo
    let html = `
        <div class="detail-section">
            <h4>Etapa ${node.id} de ${flowData.length}</h4>
            <h2 style="font-size: 22px; margin-bottom: 16px; color: var(--text-primary);">${node.title}</h2>
        </div>
        
        <div class="detail-section">
            <h4>Responsável</h4>
            <div class="detail-badge">${node.responsible}</div>
        </div>
        
        <div class="detail-section">
            <h4>Resumo</h4>
            <p style="color: var(--text-secondary); line-height: 1.6;">${node.summary}</p>
        </div>
        
        <div class="detail-section">
            <h4>Detalhes da Etapa</h4>
            <ul class="detail-list">
    `;
    
    node.details.forEach(detail => {
        html += `<li>${detail}</li>`;
    });
    
    html += `
            </ul>
        </div>
    `;
    
    // Adicionar botões de navegação
    html += `
        <div class="detail-section" style="display: flex; gap: 12px; margin-top: 32px;">
    `;
    
    if (node.id > 1) {
        html += `
            <button class="view-btn" onclick="navigateToNode(${node.id - 1})" style="flex: 1;">
                ← Anterior
            </button>
        `;
    }
    
    if (node.id < flowData.length) {
        html += `
            <button class="view-btn" onclick="navigateToNode(${node.id + 1})" style="flex: 1;">
                Próxima →
            </button>
        `;
    }
    
    html += `
        </div>
    `;
    
    content.innerHTML = html;
    panel.classList.add('open');
}

function hideDetailsPanel() {
    const panel = document.getElementById('details-panel');
    panel.classList.remove('open');
    
    // Remover classe active de todos os nós
    document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active'));
    
    selectedNode = null;
}

function navigateToNode(nodeId) {
    const node = flowData.find(n => n.id === nodeId);
    if (node) {
        showNodeDetails(node);
        
        // Scroll até o nó
        const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ============================================
// UTILITÁRIOS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleResize() {
    renderFlowchart();
    setTimeout(() => {
        drawConnections();
    }, 100);
}

// ============================================
// ATALHOS DE TECLADO
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC para recolher nós expandidos
    if (e.key === 'Escape') {
        hideDetailsPanel();
        collapseAllNodes();
    }
    
    // Setas para navegar entre nós (quando painel aberto)
    if (selectedNode) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (selectedNode.id > 1) {
                navigateToNode(selectedNode.id - 1);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (selectedNode.id < flowData.length) {
                navigateToNode(selectedNode.id + 1);
            }
        }
    }
    
    // + e - para zoom
    if (e.key === '+' || e.key === '=') {
        handleZoom('zoom-in');
    } else if (e.key === '-' || e.key === '_') {
        handleZoom('zoom-out');
    } else if (e.key === '0') {
        handleZoom('zoom-reset');
    }
});
