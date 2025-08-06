// Configuração das páginas
const pages = [
    { id: 'intro', title: 'Introdução', file: 'intro.html', className: 'main-content intro-page' },
    { id: 'malaria-definicao', title: 'Malária: Definição e Contágio', file: 'malaria-definicao.html', className: 'main-content' },
    { id: 'malaria-sintomas', title: 'Malária: Sintomas, Incubação e Tratamento', file: 'malaria-sintomas.html', className: 'main-content' },
    { id: 'chagas-definicao', title: 'Doença de Chagas: Definição e Contágio', file: 'chagas-definicao.html', className: 'main-content' },
    { id: 'chagas-sintomas', title: 'Doença de Chagas: Sintomas, Incubação e Tratamento', file: 'chagas-sintomas.html', className: 'main-content' },
    { id: 'leishmaniose-definicao', title: 'Leishmaniose Visceral: Definição e Contágio', file: 'leishmaniose-definicao.html', className: 'main-content' },
    { id: 'leishmaniose-sintomas', title: 'Leishmaniose Visceral: Sintomas, Incubação e Tratamento', file: 'leishmaniose-sintomas.html', className: 'main-content' },
    { id: 'prevencao', title: 'Prevenção das Doenças', file: 'prevencao.html', className: 'main-content' },
    { id: 'referencias', title: 'Referências Bibliográficas', file: 'referencias.html', className: 'main-content' }
];

let currentIndex = 0;
const mainContent = document.querySelector('.main-content');

// Função para carregar o conteúdo de uma página
async function loadPage(index) {
    if (index < 0 || index >= pages.length) return;

    try {
        const page = pages[index];
        const response = await fetch(page.file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const content = await response.text();

        // Adiciona uma animação de fade out
        mainContent.style.opacity = '0';

        setTimeout(() => {
            mainContent.className = page.className || 'main-content';
            mainContent.innerHTML = content;
            mainContent.scrollTop = 0; // Garante que o conteúdo comece do topo

            // Adiciona uma animação de fade in
            mainContent.style.opacity = '1';

            // Re-executa funções que dependem do conteúdo dinâmico
            addSmoothAnimations();
            createMalariaChart();
        }, 300); // Tempo para a animação de fade out

    } catch (error) {
        console.error('Erro ao carregar a página:', error);
        mainContent.innerHTML = `<p class="warning-text">Erro ao carregar o conteúdo. Tente novamente.</p>`;
    }
}

// Função para navegar para uma página específica
function navigateToPage(index) {
    if (index < 0 || index >= pages.length || index === currentIndex) return;

    currentIndex = index;
    const page = pages[currentIndex];

    // Atualiza o estado no histórico do navegador
    history.pushState({ index: currentIndex }, page.title, `#${page.id}`);
    document.title = page.title;

    loadPage(currentIndex);
    updateInterface();
}

// Funções de navegação
const nextPage = () => navigateToPage(currentIndex + 1);
const prevPage = () => navigateToPage(currentIndex - 1);
const goHome = () => navigateToPage(0);

// Função para atualizar todos os elementos da interface
function updateInterface() {
    updateSlideIndicators();
    updateSlideCounter();
    updateNavigationButtons();
}

// Funções de atualização da interface (modificadas para usar a variável global currentIndex)
function updateSlideIndicators() {
    const indicators = document.querySelectorAll('.slide-dot');
    indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function updateSlideCounter() {
    const counter = document.querySelector('.slide-counter');
    if (counter) {
        counter.textContent = `${currentIndex + 1} / ${pages.length}`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    const homeBtn = document.querySelector('.nav-button.home');

    if (prevBtn) prevBtn.disabled = currentIndex === 0;

    const isLastPage = currentIndex === pages.length - 1;
    if (nextBtn) nextBtn.style.display = isLastPage ? 'none' : 'inline-flex';
    if (homeBtn) homeBtn.style.display = isLastPage ? 'inline-flex' : 'none';
}

// Função para criar os indicadores de slide
function createSlideIndicators() {
    const indicatorsContainer = document.querySelector('.slide-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        pages.forEach((page, index) => {
            const dot = document.createElement('div');
            dot.className = 'slide-dot';
            dot.title = page.title;
            dot.addEventListener('click', () => navigateToPage(index));
            indicatorsContainer.appendChild(dot);
        });
    }
}

// Função para adicionar eventos de teclado
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'Home') {
            e.preventDefault();
            goHome();
        }
    });
}

// Função para lidar com o evento popstate (botões de voltar/avançar do navegador)
function handlePopState(event) {
    if (event.state && typeof event.state.index !== 'undefined') {
        currentIndex = event.state.index;
    } else {
        // Se não houver estado, determina o índice a partir do hash da URL
        const pageId = window.location.hash.substring(1);
        currentIndex = pages.findIndex(p => p.id === pageId);
        if (currentIndex === -1) currentIndex = 0;
    }

    document.title = pages[currentIndex].title;
    loadPage(currentIndex);
    updateInterface();
}

// Função para inicializar a aplicação
function init() {
    // Determina a página inicial a partir da URL
    const pageId = window.location.hash.substring(1);
    const initialIndex = pages.findIndex(p => p.id === pageId);
    currentIndex = initialIndex !== -1 ? initialIndex : 0;

    // Adiciona o estado inicial ao histórico
    history.replaceState({ index: currentIndex }, pages[currentIndex].title, `#${pages[currentIndex].id}`);
    document.title = pages[currentIndex].title;

    // Configura os elementos da interface
    createSlideIndicators();

    // Adiciona eventos
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    const homeBtn = document.querySelector('.nav-button.home');

    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (homeBtn) homeBtn.addEventListener('click', goHome);

    addKeyboardNavigation();
    window.addEventListener('popstate', handlePopState);

    // Carrega o conteúdo inicial e atualiza a interface
    loadPage(currentIndex);
    updateInterface();
}

// --- Funções reaproveitadas do script original ---

function addSmoothAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.disease-card, .reference-item, .intro-card, .chart-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function createMalariaChart() {
    const chartContainer = document.querySelector('#malaria-chart');
    if (chartContainer) {
        const data = [
            { species: 'P. vivax', period: '12-17 dias', percentage: 60, class: 'vivax' },
            { species: 'P. falciparum', period: '9-14 dias', percentage: 50, class: 'falciparum' },
            { species: 'P. ovale', period: '16-18 dias', percentage: 70, class: 'ovale' },
            { species: 'P. malariae', period: '18-40 dias', percentage: 90, class: 'malariae' }
        ];
        
        chartContainer.innerHTML = data.map(item => `
            <div class="chart-bar">
                <div class="chart-label">${item.species}:</div>
                <div class="chart-bar-fill ${item.class}" style="width: ${item.percentage}%">
                    ${item.period}
                </div>
            </div>
        `).join('');
    }
}

// Adiciona um efeito de transição ao main-content
if (mainContent) {
    mainContent.style.transition = 'opacity 0.3s ease-in-out';
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
