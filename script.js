// --- Estat Global (Dades CSV 2024 Reals) ---
const AppState = {
    lang: 'ca',
    mesos: 12,
    mods: { ia: 1.0, clima: 1.0, paper: 1.0 },
    base: {
        elec: { val: 2912, un: "kWh", co2: 0.321, ic: "⚡", nom: "Electricitat" },
        gas:  { val: 1282, un: "kWh", co2: 0.202, ic: "🔥", nom: "Gas Natural" },
        water:{ val: 35,   un: "m³",  co2: 0.20,  ic: "💧", nom: "Aigua" },
        paper:{ val: 20,   un: "packs",co2: 1.2,  ic: "📄", nom: "Paper" }
    },
    exportData: {} 
};

let radarChart, doughnutChart, seasonalChart;

// --- Diccionari Multi-idioma Complet (CA, ES, EN, DE) ---
const i18n = {
    ca: {
        app_title: "EcoAudit ASIR | Consultoria", nav_dashboard: "Dashboard & Gràfics", nav_calc: "Calculadora & Simulació", nav_var: "Cicles Estacionals", nav_data: "Exportar Informe JSON", footer_text: "ITB Sostenibilitat TIC - G11",
        header_title: "Anàlisi de Petjada Ambiental (Fase 1 i 3)", lbl_period: "Període:", lbl_months: "mesos", lbl_annual: "Anual",
        kpi_elec: "Electricitat", kpi_gas: "Gas Natural", kpi_water: "Aigua", kpi_paper: "Paper", unit_packs: "paquets",
        chart_radar: "Radar d'Eficiència (% de Reducció sobre Base)", chart_doughnut: "Distribució d'Emissions CO2e",
        table_title: "🔍 Desglossament Detallat de l'Impacte", th_ind: "Indicador", th_calc1: "Càlcul 1: Anual", th_calc2: "Càlcul 2: Període", th_fact: "Factor CO2", th_emis: "Emissions CO2e",
        calc_title: "🧮 Calculadora (KPIs 2024)", calc_desc: "Modifica els valors base mensuals.", strat_title: "🌱 Simulació d'Accions (-30%)", strat_desc: "Activa estratègies.",
        btn_ia: "IA (-15% Llum)", btn_clima: "Aïllament (-25% Gas)", btn_paper: "Zero Paper (-90%)", banner_target: "Objectiu Any 3 (-30%):",
        var_title: "🌦️ Tendències Temporals i Estacionals", var_desc: "Simulació del comportament del consum.", data_title: "📂 Exportació JSON", btn_down: "Descarregar Informe", data_desc: "Combina les dades de la Fase 1 i projeccions de la Fase 3."
    },
    es: {
        app_title: "EcoAudit ASIR | Consultoría", nav_dashboard: "Panel & Gráficos", nav_calc: "Calculadora & Simulación", nav_var: "Ciclos Estacionales", nav_data: "Exportar Informe JSON", footer_text: "ITB Sostenibilidad TIC - G11",
        header_title: "Análisis de Huella Ambiental (Fase 1 y 3)", lbl_period: "Período:", lbl_months: "meses", lbl_annual: "Anual",
        kpi_elec: "Electricidad", kpi_gas: "Gas Natural", kpi_water: "Agua", kpi_paper: "Papel", unit_packs: "paquetes",
        chart_radar: "Radar de Eficiencia (% Reducción vs Base)", chart_doughnut: "Distribución de Emisiones CO2e",
        table_title: "🔍 Desglose Detallado del Impacto", th_ind: "Indicador", th_calc1: "Cálculo 1: Anual", th_calc2: "Cálculo 2: Período", th_fact: "Factor CO2", th_emis: "Emisiones CO2e",
        calc_title: "🧮 Calculadora (KPIs 2024)", calc_desc: "Modifica los valores base mensuales.", strat_title: "🌱 Simulación de Acciones (-30%)", strat_desc: "Activa estrategias.",
        btn_ia: "IA (-15% Luz)", btn_clima: "Aislamiento (-25% Gas)", btn_paper: "Cero Papel (-90%)", banner_target: "Objetivo Año 3 (-30%):",
        var_title: "🌦️ Tendencias Temporales y Estacionales", var_desc: "Simulación del comportamiento de consumo.", data_title: "📂 Exportación JSON", btn_down: "Descargar Informe", data_desc: "Combina los datos de la Fase 1 y las proyecciones de la Fase 3."
    },
    en: {
        app_title: "EcoAudit ASIR | Consulting", nav_dashboard: "Dashboard & Charts", nav_calc: "Calculator & Simulation", nav_var: "Seasonal Cycles", nav_data: "Export JSON Report", footer_text: "ITB ICT Sustainability - G11",
        header_title: "Environmental Footprint Analysis (Phase 1 & 3)", lbl_period: "Period:", lbl_months: "months", lbl_annual: "Annual",
        kpi_elec: "Electricity", kpi_gas: "Natural Gas", kpi_water: "Water", kpi_paper: "Paper", unit_packs: "packs",
        chart_radar: "Efficiency Radar (% Reduction vs Baseline)", chart_doughnut: "CO2e Emissions Distribution",
        table_title: "🔍 Detailed Impact Breakdown", th_ind: "Indicator", th_calc1: "Calc 1: Annual", th_calc2: "Calc 2: Period", th_fact: "CO2 Factor", th_emis: "CO2e Emissions",
        calc_title: "🧮 Calculator (2024 KPIs)", calc_desc: "Modify monthly base values.", strat_title: "🌱 Action Simulation (-30%)", strat_desc: "Activate strategies.",
        btn_ia: "AI (-15% Power)", btn_clima: "Insulation (-25% Gas)", btn_paper: "Zero Paper (-90%)", banner_target: "Year 3 Target (-30%):",
        var_title: "🌦️ Temporal and Seasonal Trends", var_desc: "Consumption behavior simulation.", data_title: "📂 JSON Export", btn_down: "Download Report", data_desc: "Combines Phase 1 data and Phase 3 projections."
    },
    de: { // ALEMÁN AÑADIDO
        app_title: "EcoAudit ASIR | Beratung", nav_dashboard: "Dashboard & Diagramme", nav_calc: "Rechner & Simulation", nav_var: "Saisonale Zyklen", nav_data: "JSON-Bericht Exportieren", footer_text: "ITB IKT-Nachhaltigkeit - G11",
        header_title: "Analyse des Ökologischen Fußabdrucks (Phase 1 & 3)", lbl_period: "Zeitraum:", lbl_months: "Monate", lbl_annual: "Jährlich",
        kpi_elec: "Elektrizität", kpi_gas: "Erdgas", kpi_water: "Wasser", kpi_paper: "Papier", unit_packs: "Pakete",
        chart_radar: "Effizienz-Radar (% Reduktion vs. Basis)", chart_doughnut: "CO2e-Emissionsverteilung",
        table_title: "🔍 Detaillierte Aufschlüsselung", th_ind: "Indikator", th_calc1: "Ber. 1: Jährlich", th_calc2: "Ber. 2: Zeitraum", th_fact: "CO2-Faktor", th_emis: "CO2e-Emissionen",
        calc_title: "🧮 Rechner (KPIs 2024)", calc_desc: "Monatliche Basiswerte ändern.", strat_title: "🌱 Aktionssimulation (-30%)", strat_desc: "Strategien aktivieren.",
        btn_ia: "KI (-15% Strom)", btn_clima: "Isolierung (-25% Gas)", btn_paper: "Null Papier (-90%)", banner_target: "Ziel Jahr 3 (-30%):",
        var_title: "🌦️ Zeitliche und Saisonale Trends", var_desc: "Simulation des Verbrauchsverhaltens.", data_title: "📂 JSON-Export", btn_down: "Bericht Herunterladen", data_desc: "Kombiniert Phase-1-Daten und Phase-3-Projektionen."
    }
};

// --- Navegació i Idioma ---
function changeLang(lang) {
    AppState.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
    calcularTot(); 
}

function toggleTheme() { document.body.classList.toggle('light-mode'); updateChartsTheme(); }
function showPage(pageId, event) {
    if(event) event.preventDefault();
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active-page'));
    document.getElementById(`page-${pageId}`).classList.add('active-page');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');
    if(pageId === 'variability') renderSeasonalChart();
}
function toggleMenu() { document.getElementById('sidebar').classList.toggle('open'); }

// --- Funcions Calculadora ---
function syncInput(key) {
    const val = parseFloat(document.getElementById(`slide-${key}`).value);
    document.getElementById(`val-${key}`).innerText = val;
    AppState.base[key].val = val;
    calcularTot(); 
}

function toggleEstrategia(id, percent) {
    const btn = document.getElementById(`strat-${id}`);
    btn.classList.toggle('active');
    AppState.mods[id] = btn.classList.contains('active') ? (1 - percent) : 1.0;
    calcularTot();
}

// --- Generador Estacional ---
function generarDadesEstacionals(baseData) {
    const mesos = ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"];
    let dist = {};
    Object.keys(baseData).forEach(key => {
        let valBase = baseData[key].val;
        dist[key] = mesos.map((mes, idx) => {
            let factor = 1.0;
            if(idx === 7) return valBase * 0.05; // Agost Tancat
            if(key === 'gas' && [10, 11, 0, 1].includes(idx)) factor = 2.2;
            if(key === 'gas' && [5, 6].includes(idx)) factor = 0.1;
            if(key === 'elec' && [11, 0, 1].includes(idx)) factor = 1.15;
            if(key === 'water' && [4, 5, 6].includes(idx)) factor = 1.30;
            if(key === 'paper' && idx === 8) factor = 1.50;
            if(key === 'paper' && [4, 5].includes(idx)) factor = 1.25;
            return parseFloat((valBase * factor).toFixed(2));
        });
    });
    return { labels: mesos, dades: dist };
}

// --- Motor Principal ---
function calcularTot() {
    AppState.mesos = parseInt(document.getElementById('meses').value);
    const tbody = document.getElementById('calculations-body');
    tbody.innerHTML = '';
    
    let totalAnual = 0;
    let co2BaseArray = [], co2StrategyArray = [], labelsArray = [];
    const dadesEstac = generarDadesEstacionals(AppState.base);
    
    // CONSTRUCCIÓ EXPORTACIÓ JSON (FASE 1 + FASE 3)
    AppState.exportData = {
        Metadata: { 
            Projecte: "ITB Petjada Ambiental G11", 
            Data_Exportacio: new Date().toISOString() 
        },
        Fase1_Datacleaning_Original: {},  // Dades reals del DataClean
        Fase3_Proyeccions_Calculadora: {  // Dades afectades pels sliders i botons
            Mesos_Seleccionats_Usuari: AppState.mesos,
            Simulacio_Estrategies_Actives: {
                IA_Energia: AppState.mods.ia < 1 ? "Activat (-15%)" : "Desactivat",
                Aillament_Clima: AppState.mods.clima < 1 ? "Activat (-25%)" : "Desactivat",
                Zero_Paper: AppState.mods.paper < 1 ? "Activat (-90%)" : "Desactivat"
            },
            Resultats_Mensuals_Variabilitat: dadesEstac.dades
        }
    };

    Object.keys(AppState.base).forEach(key => {
        const data = AppState.base[key];
        const anualBaseEstac = dadesEstac.dades[key].reduce((a, b) => a + b, 0);
        const co2Base = anualBaseEstac * data.co2;
        
        // Modificadors
        let mod = 1.0;
        if (key === 'elec') mod = AppState.mods.ia;
        if (key === 'gas') mod = AppState.mods.clima;
        if (key === 'paper') mod = AppState.mods.paper;

        const anualEstrat = anualBaseEstac * mod;
        let periodoEstrat = 0;
        for(let i=0; i < AppState.mesos; i++) periodoEstrat += (dadesEstac.dades[key][i] * mod);
        
        const co2Estrat = anualEstrat * data.co2;
        totalAnual += co2Estrat;

        const langName = i18n[AppState.lang][`kpi_${key}`] || data.nom;
        labelsArray.push(langName);
        co2BaseArray.push(co2Base);
        co2StrategyArray.push(co2Estrat);

        let langUnit = data.un === "packs" ? i18n[AppState.lang].unit_packs : data.un;

        // UI Dashboard
        document.getElementById(`kpi-${key}`).innerText = formatNum(periodoEstrat);
        document.getElementById(`kpi-${key}-anual`).innerText = `${formatNum(anualEstrat)} ${langUnit}`;

        tbody.innerHTML += `<tr>
            <td>${data.ic} <strong>${langName}</strong></td>
            <td>${formatNum(anualEstrat)} <span class="desc-text">${langUnit}</span></td>
            <td><strong>${formatNum(periodoEstrat)}</strong> <span class="desc-text">${langUnit}</span></td>
            <td>${data.co2} kg/u</td>
            <td class="accent font-bold">${formatNum(co2Estrat, 2)} kg</td>
        </tr>`;

        // Guardar a l'export json (Fase 1)
        AppState.exportData.Fase1_Datacleaning_Original[langName] = { 
            Mitjana_Mensual_Original_2024: data.val, 
            Unitat: langUnit, 
            Factor_Emissio_CO2: data.co2 
        };
    });

    document.getElementById('target-30-value').innerText = formatNum(totalAnual * 0.70) + " kg CO2e";
    document.getElementById('json-display').textContent = JSON.stringify(AppState.exportData, null, 4);

    updateCharts(labelsArray, co2BaseArray, co2StrategyArray);
}

// --- Integració CHART.JS (Radar en Percentatges) ---
function getChartColors() { return document.body.classList.contains('light-mode') ? { t: '#475569', g: 'rgba(0,0,0,0.1)' } : { t: '#94a3b8', g: 'rgba(255,255,255,0.1)' }; }

function updateCharts(labels, baseData, strategyData) {
    const col = getChartColors();
    Chart.defaults.color = col.t;

    // RADAR 100%: Transforma la reducció en % pur per ser super visual.
    const pctBase = [100, 100, 100, 100];
    const pctStrategy = strategyData.map((val, i) => (val / baseData[i]) * 100);

    if (radarChart) {
        radarChart.data.labels = labels;
        radarChart.data.datasets[1].data = pctStrategy;
        radarChart.update();
    } else {
        const ctxR = document.getElementById('radarChart').getContext('2d');
        radarChart = new Chart(ctxR, {
            type: 'radar',
            data: { labels: labels, datasets: [
                { label: 'Base (100%)', data: pctBase, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', borderDash: [5, 5], borderWidth: 1 },
                { label: 'Estratègia (%)', data: pctStrategy, backgroundColor: 'rgba(59, 130, 246, 0.4)', borderColor: '#3b82f6', borderWidth: 2 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100, angleLines: { color: col.g }, grid: { color: col.g }, ticks: { stepSize: 25, backdropColor: 'transparent' } } } }
        });
    }

    if (doughnutChart) {
        doughnutChart.data.labels = labels;
        doughnutChart.data.datasets[0].data = strategyData;
        doughnutChart.update();
    } else {
        const ctxD = document.getElementById('doughnutChart').getContext('2d');
        doughnutChart = new Chart(ctxD, {
            type: 'doughnut',
            data: { labels: labels, datasets: [{ data: strategyData, backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#f59e0b'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
        });
    }
}

function renderSeasonalChart() {
    const col = getChartColors();
    const dades = generarDadesEstacionals(AppState.base);
    
    if(seasonalChart) {
        seasonalChart.data.datasets[0].data = dades.dades.gas;
        seasonalChart.data.datasets[1].data = dades.dades.elec;
        seasonalChart.update();
    } else {
        const ctxS = document.getElementById('seasonalChart').getContext('2d');
        seasonalChart = new Chart(ctxS, {
            type: 'line',
            data: {
                labels: dades.labels,
                datasets: [
                    { label: 'Gas (kWh)', data: dades.dades.gas, borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)', fill: true, tension: 0.4 },
                    { label: 'Electricitat (kWh)', data: dades.dades.elec, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: col.g } }, x: { grid: { color: col.g } } } }
        });
    }
}

function updateChartsTheme() { if(radarChart) radarChart.destroy(); if(doughnutChart) doughnutChart.destroy(); if(seasonalChart) seasonalChart.destroy(); radarChart=null; doughnutChart=null; seasonalChart=null; calcularTot(); }

function descargarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.exportData, null, 4));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "EcoAudit_Informe_Fase1_y_3.json");
    dlAnchorElem.click();
}

function formatNum(num, dec = 0) { return num.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

window.onload = () => { changeLang('ca'); calcularTot(); };
