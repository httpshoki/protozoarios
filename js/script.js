// Configuração das páginas
const pages = [
    { id: 'index', title: 'Introdução', file: 'index.html' },
    { id: 'malaria-definicao', title: 'Malária: Definição e Contágio', file: 'malaria-definicao.html' },
    { id: 'malaria-sintomas', title: 'Malária: Sintomas, Incubação e Tratamento', file: 'malaria-sintomas.html' },
    { id: 'chagas-definicao', title: 'Doença de Chagas: Definição e Contágio', file: 'chagas-definicao.html' },
    { id: 'chagas-sintomas', title: 'Doença de Chagas: Sintomas, Incubação e Tratamento', file: 'chagas-sintomas.html' },
    { id: 'leishmaniose-definicao', title: 'Leishmaniose Visceral: Definição e Contágio', file: 'leishmaniose-definicao.html' },
    { id: 'leishmaniose-sintomas', title: 'Leishmaniose Visceral: Sintomas, Incubação e Tratamento', file: 'leishmaniose-sintomas.html' },
    { id: 'prevencao', title: 'Prevenção das Doenças', file: 'prevencao.html' },
    { id: 'referencias', title: 'Referências Bibliográficas', file: 'referencias.html' }
];

// Função para obter o índice da página atual
function getCurrentPageIndex() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    return pages.findIndex(page => page.file === currentPage);
}

// Função para navegar para uma página específica
function navigateToPage(index) {
    if (index >= 0 && index < pages.length) {
        window.location.href = pages[index].file;
    }
}

// Função para ir para a próxima página
function nextPage() {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex < pages.length - 1) {
        navigateToPage(currentIndex + 1);
    }
}

// Função para ir para a página anterior
function prevPage() {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex > 0) {
        navigateToPage(currentIndex - 1);
    }
}

// Função para ir para a página inicial
function goHome() {
    window.location.href = 'index.html';
}

// Função para atualizar os indicadores de slide
function updateSlideIndicators() {
    const currentIndex = getCurrentPageIndex();
    const indicators = document.querySelectorAll('.slide-dot');
    
    indicators.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Função para atualizar o contador de slides
function updateSlideCounter() {
    const currentIndex = getCurrentPageIndex();
    const counter = document.querySelector('.slide-counter');
    if (counter) {
        counter.textContent = `${currentIndex + 1} / ${pages.length}`;
    }
}

// Função para atualizar os botões de navegação
function updateNavigationButtons() {
    const currentIndex = getCurrentPageIndex();
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        if (currentIndex === 0) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentIndex === pages.length - 1;
        if (currentIndex === pages.length - 1) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }
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
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevPage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextPage();
                break;
            case 'Home':
                e.preventDefault();
                goHome();
                break;
        }
    });
}

// Função para adicionar animações suaves
function addSmoothAnimations() {
    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    document.querySelectorAll('.disease-card, .reference-item, .intro-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Função para criar gráfico simples de incubação da malária
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

// Função para inicializar a página
function initializePage() {
    // Criar indicadores de slide
    createSlideIndicators();
    
    // Atualizar elementos da interface
    updateSlideIndicators();
    updateSlideCounter();
    updateNavigationButtons();
    
    // Adicionar navegação por teclado
    addKeyboardNavigation();
    
    // Adicionar animações
    addSmoothAnimations();
    
    // Criar gráfico se necessário
    createMalariaChart();
    
    // Adicionar eventos aos botões de navegação
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    const homeBtn = document.querySelector('.nav-button.home');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initializePage);

// Função utilitária para destacar texto
function highlightText(text, className = 'highlight') {
    return `<span class="${className}">${text}</span>`;
}

// Função para mostrar/ocultar detalhes (se necessário)
function toggleDetails(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

