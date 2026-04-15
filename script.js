/* ══════════════════════════════════════════════════════════════
   EcoAudit ASIR — script.js
   5 indicadors: elec, gas, water, paper, clean
   8 càlculs requerits (RA 3.1a) + pla reducció (3.1b)
══════════════════════════════════════════════════════════════ */

/* ── ESTAT GLOBAL ─────────────────────────────────────────── */
const S = {
  lang:  'ca',
  mesos: 12,
  mods:  { ia: 1, clima: 1, paper: 1, water: 1, clean: 1 },
  base: {
    elec:  { val: 2912, un: 'kWh',  co2: 0.321, nom: 'Electricitat'   },
    gas:   { val: 1282, un: 'kWh',  co2: 0.202, nom: 'Gas Natural'    },
    water: { val: 35,   un: 'm³',   co2: 0.20,  nom: 'Aigua'          },
    paper: { val: 20,   un: 'packs',co2: 1.20,  nom: 'Paper Oficina'  },
    clean: { val: 15,   un: 'L',    co2: 0.80,  nom: 'Prod. Neteja'   }
  },
  export: {}
};

/* ── i18n ─────────────────────────────────────────────────── */
const T = {
  ca: {
    app_title:'EcoAudit ASIR | ITB G11',
    nav_dashboard:'Dashboard & Gràfics', nav_calc:'Calculadora & 8 Càlculs',
    nav_var:'Cicles Estacionals', nav_plan:'Pla Reducció 3 Anys', nav_data:'Exportar JSON',
    footer_text:'ITB Sostenibilitat TIC - G11',
    header_title:'Petjada Ambiental ITB',
    lbl_period:'Període', lbl_months:'mesos', lbl_annual:'Anual',
    kpi_elec:'Electricitat', kpi_gas:'Gas Natural', kpi_water:'Aigua',
    kpi_paper:'Paper Oficina', kpi_clean:'Prod. Neteja',
    unit_packs:'paquets',
    chart_radar:"Radar d'Eficiència", chart_doughnut:'Distribució CO2e',
    table_title:'Taula dels 8 Càlculs Requerits (RA 3.1a)',
    th_ind:'Indicador', th_calc1:'Consum Anual (12m)', th_calc2:'Consum Set–Jun (10m)',
    th_fact:'Factor CO2e', th_emis:'CO2e Anual',
    calc_title:'Calculadora & Simulació', calc_desc:'Ajusta els valors mensuals i activa estratègies per veure l\'impacte en temps real sobre tots els indicadors.',
    strat_title:'Simulació Estratègies', strat_desc:'Activa per veure l\'impacte en el radar en temps real.',
    btn_ia:'IA (−15% Llum)', btn_clima:'Aïllament (−25% Gas)', btn_paper:'Zero Paper (−90%)',
    banner_target:'Objectiu Any 3 (−30%)',
    var_title:'Cicles Estacionals i Tendències', var_desc:'Variabilitat mensual calculada a partir de 10_DATACLEANING.csv. Agost: centre tancat (5% del valor base).',
    data_title:'Exportació JSON', btn_down:'Descarregar JSON',
    data_desc:'Conté les dades del DataClean (Fase 1) i les projeccions amb estratègies actives (Fase 3).'
  },
  es: {
    app_title:'EcoAudit ASIR | ITB G11',
    nav_dashboard:'Panel & Gráficos', nav_calc:'Calculadora & 8 Cálculos',
    nav_var:'Ciclos Estacionales', nav_plan:'Plan Reducción 3 Años', nav_data:'Exportar JSON',
    footer_text:'ITB Sostenibilidad TIC - G11',
    header_title:'Huella Ambiental ITB',
    lbl_period:'Período', lbl_months:'meses', lbl_annual:'Anual',
    kpi_elec:'Electricidad', kpi_gas:'Gas Natural', kpi_water:'Agua',
    kpi_paper:'Papel Oficina', kpi_clean:'Prod. Limpieza',
    unit_packs:'paquetes',
    chart_radar:'Radar de Eficiencia', chart_doughnut:'Distribución CO2e',
    table_title:'Tabla de los 8 Cálculos Requeridos (RA 3.1a)',
    th_ind:'Indicador', th_calc1:'Consumo Anual (12m)', th_calc2:'Consumo Sep–Jun (10m)',
    th_fact:'Factor CO2e', th_emis:'CO2e Anual',
    calc_title:'Calculadora & Simulación', calc_desc:'Ajusta los valores mensuales y activa estrategias para ver el impacto en tiempo real.',
    strat_title:'Simulación Estrategias', strat_desc:'Activa para ver el impacto en el radar en tiempo real.',
    btn_ia:'IA (−15% Luz)', btn_clima:'Aislamiento (−25% Gas)', btn_paper:'Cero Papel (−90%)',
    banner_target:'Objetivo Año 3 (−30%)',
    var_title:'Ciclos Estacionales y Tendencias', var_desc:'Variabilidad mensual calculada a partir de 10_DATACLEANING.csv. Agosto: centro cerrado (5% del valor base).',
    data_title:'Exportación JSON', btn_down:'Descargar JSON',
    data_desc:'Contiene los datos del DataClean (Fase 1) y las proyecciones con estrategias activas (Fase 3).'
  },
  en: {
    app_title:'EcoAudit ASIR | ITB G11',
    nav_dashboard:'Dashboard & Charts', nav_calc:'Calculator & 8 Calculations',
    nav_var:'Seasonal Cycles', nav_plan:'3-Year Reduction Plan', nav_data:'Export JSON',
    footer_text:'ITB ICT Sustainability - G11',
    header_title:'ITB Environmental Footprint',
    lbl_period:'Period', lbl_months:'months', lbl_annual:'Annual',
    kpi_elec:'Electricity', kpi_gas:'Natural Gas', kpi_water:'Water',
    kpi_paper:'Office Paper', kpi_clean:'Cleaning Prod.',
    unit_packs:'packs',
    chart_radar:'Efficiency Radar', chart_doughnut:'CO2e Distribution',
    table_title:'Table of 8 Required Calculations (RA 3.1a)',
    th_ind:'Indicator', th_calc1:'Annual Consumption (12m)', th_calc2:'Sep–Jun Period (10m)',
    th_fact:'CO2e Factor', th_emis:'Annual CO2e',
    calc_title:'Calculator & Simulation', calc_desc:'Adjust monthly values and activate strategies to see real-time impact on all indicators.',
    strat_title:'Strategy Simulation', strat_desc:'Activate to see real-time impact on the radar chart.',
    btn_ia:'AI (−15% Power)', btn_clima:'Insulation (−25% Gas)', btn_paper:'Zero Paper (−90%)',
    banner_target:'Year 3 Target (−30%)',
    var_title:'Seasonal Cycles & Trends', var_desc:'Monthly variability calculated from 10_DATACLEANING.csv. August: centre closed (5% of base value).',
    data_title:'JSON Export', btn_down:'Download JSON',
    data_desc:'Contains DataClean data (Phase 1) and projections with active strategies (Phase 3).'
  },
  de: {
    app_title:'EcoAudit ASIR | ITB G11',
    nav_dashboard:'Dashboard & Diagramme', nav_calc:'Rechner & 8 Berechnungen',
    nav_var:'Saisonale Zyklen', nav_plan:'3-Jahres-Reduktionsplan', nav_data:'JSON Exportieren',
    footer_text:'ITB IKT-Nachhaltigkeit - G11',
    header_title:'ITB Ökologischer Fußabdruck',
    lbl_period:'Zeitraum', lbl_months:'Monate', lbl_annual:'Jährlich',
    kpi_elec:'Elektrizität', kpi_gas:'Erdgas', kpi_water:'Wasser',
    kpi_paper:'Büropapier', kpi_clean:'Reinigungsm.',
    unit_packs:'Pakete',
    chart_radar:'Effizienz-Radar', chart_doughnut:'CO2e-Verteilung',
    table_title:'Tabelle der 8 Berechnungen (RA 3.1a)',
    th_ind:'Indikator', th_calc1:'Jahresverbrauch (12M)', th_calc2:'Sep–Jun (10M)',
    th_fact:'CO2e-Faktor', th_emis:'Jährliches CO2e',
    calc_title:'Rechner & Simulation', calc_desc:'Monatswerte anpassen und Strategien aktivieren.',
    strat_title:'Strategie-Simulation', strat_desc:'Aktivieren für Echtzeit-Radar-Auswirkungen.',
    btn_ia:'KI (−15% Strom)', btn_clima:'Isolierung (−25% Gas)', btn_paper:'Null Papier (−90%)',
    banner_target:'Ziel Jahr 3 (−30%)',
    var_title:'Saisonale Zyklen & Trends', var_desc:'Monatliche Variabilität aus 10_DATACLEANING.csv. August: geschlossen (5% des Basiswerts).',
    data_title:'JSON-Export', btn_down:'Bericht Herunterladen',
    data_desc:'Enthält DataClean-Daten (Phase 1) und Projektionen mit aktiven Strategien (Phase 3).'
  }
};

/* ── CHARTS ───────────────────────────────────────────────── */
let RC = null, DC = null, SC1 = null, SC2 = null;
let isLight = false;

/* ── NAVEGACIÓ ────────────────────────────────────────────── */
function go(id, e) {
  if (e) e.preventDefault();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  pg.classList.add('active');
  pg.style.animation = 'none';
  pg.offsetHeight;
  pg.style.animation = '';
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (e) e.currentTarget.classList.add('active');
  if (window.innerWidth <= 900) closeSB();
  if (id === 'seasonal') drawSeasonal();
}

function openSB() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeSB() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/* ── TEMA ─────────────────────────────────────────────────── */
function toggleTheme() {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  document.getElementById('theme-btn').textContent = isLight ? '🌙' : '☀️';
  destroyCharts();
  recalc();
}

/* ── IDIOMA ───────────────────────────────────────────────── */
function changeLang(l) {
  S.lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (T[l]?.[k]) el.textContent = T[l][k];
  });
  document.title = T[l].app_title;
  recalc();
}

/* ── ESTACIONALITAT ───────────────────────────────────────── */
/*
  Estratègia 1 (Tendències Temporals): Gas alt a l'hivern, baix a l'estiu.
  Electricitat lleugerament més alta a l'hivern per il·luminació.
  Estratègia 2 (Cicles Estacionals): Aigua alta a primavera/estiu.
  Paper alt a inici de curs (set) i exàmens (abr–mai).
  Neteja alta a inici de curs i hivern (grip).
  Agost = centre tancat → tots els valors al 5%.
*/
function seasonal(base) {
  const labels = ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'];
  const d = {};
  Object.keys(base).forEach(k => {
    const v = base[k].val;
    d[k] = labels.map((_, i) => {
      if (i === 7) return +(v * 0.05).toFixed(2); // Agost tancat
      let f = 1.0;
      // Gas: hivern molt alt, estiu gairebé zero
      if (k === 'gas'   && [10,11,0,1].includes(i)) f = 2.20;
      if (k === 'gas'   && [2].includes(i))          f = 1.60;
      if (k === 'gas'   && [3,4].includes(i))        f = 0.50;
      if (k === 'gas'   && [5,6].includes(i))        f = 0.10;
      if (k === 'gas'   && [8,9].includes(i))        f = 0.80;
      // Electricitat: una mica alta a l'hivern per il·luminació
      if (k === 'elec'  && [11,0,1].includes(i))     f = 1.15;
      if (k === 'elec'  && [5,6].includes(i))        f = 0.90;
      // Aigua: alta a primavera-estiu (jardí/refrigeració)
      if (k === 'water' && [4,5,6].includes(i))      f = 1.30;
      if (k === 'water' && [8].includes(i))          f = 1.10;
      if (k === 'water' && [11,0,1].includes(i))     f = 0.85;
      // Paper: inici curs i exàmens
      if (k === 'paper' && i === 8)                  f = 1.50; // Set
      if (k === 'paper' && [3,4].includes(i))        f = 1.25; // Abr-Mai
      if (k === 'paper' && [5,6].includes(i))        f = 0.50;
      // Neteja: alta a inici curs i hivern, baixa a estiu
      if (k === 'clean' && i === 8)                  f = 1.40; // Set: neteja fons
      if (k === 'clean' && [10,11,0,1].includes(i)) f = 1.10; // Hivern: grip
      if (k === 'clean' && [5,6].includes(i))        f = 0.55; // Estiu: poca activitat
      return +(v * f).toFixed(2);
    });
  });
  return { labels, d };
}

/* ── SLIDERS ──────────────────────────────────────────────── */
function sync(k) {
  const v = +document.getElementById('slide-' + k).value;
  document.getElementById('val-' + k).textContent = v;
  S.base[k].val = v;
  recalc();
}

/* ── ESTRATÈGIES ──────────────────────────────────────────── */
function toggleStrat(id, pct) {
  const btn = document.getElementById('strat-' + id);
  btn.classList.toggle('on');
  S.mods[id] = btn.classList.contains('on') ? (1 - pct) : 1.0;
  recalc();
}

/* ── RECALCUL PRINCIPAL ───────────────────────────────────── */
function recalc() {
  S.mesos = +document.getElementById('mesos').value || 12;
  const seas = seasonal(S.base);
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  let totalCO2anual = 0;
  let totalCO2strat = 0;
  const labels = [], baseArr = [], stratArr = [];
  let rowNum = 1;

  S.export = {
    Metadata: {
      Projecte: 'ITB Petjada Ambiental G11',
      Data_Exportacio: new Date().toISOString(),
      Fase: '1 (DataClean original) + 3 (Projeccions amb estratègies)'
    },
    Fase1_DataClean_Original: {},
    Fase3_Projeccions: {
      Mesos_Analitzats: S.mesos,
      Periode_Academia: 'Setembre–Juny (10 mesos)',
      Estrategies_Actives: {
        IA_Energia:       S.mods.ia    < 1 ? `Activat (${Math.round((1-S.mods.ia)*100)}% reducció)` : 'Desactivat',
        Aillament_Clima:  S.mods.clima < 1 ? `Activat (${Math.round((1-S.mods.clima)*100)}% reducció)` : 'Desactivat',
        Zero_Paper:       S.mods.paper < 1 ? `Activat (${Math.round((1-S.mods.paper)*100)}% reducció)` : 'Desactivat',
        Estalvi_Aigua:    S.mods.water < 1 ? `Activat (${Math.round((1-S.mods.water)*100)}% reducció)` : 'Desactivat',
        Neteja_Eco:       S.mods.clean < 1 ? `Activat (${Math.round((1-S.mods.clean)*100)}% reducció)` : 'Desactivat'
      },
      Variabilitat_Mensual: seas.d,
      Resultats_Per_Indicador: {}
    }
  };

  /* ── MAP: modifier per indicador ── */
  const modMap = {
    elec:  S.mods.ia,
    gas:   S.mods.clima,
    water: S.mods.water,
    paper: S.mods.paper,
    clean: S.mods.clean
  };

  Object.keys(S.base).forEach(k => {
    const b   = S.base[k];
    const mod = modMap[k];

    // Anual base (amb estacionalitat)
    const anualBase  = seas.d[k].reduce((a, c) => a + c, 0);
    const co2Base    = anualBase * b.co2;

    // Anual amb estratègia
    const anualStrat = anualBase * mod;
    const co2Strat   = anualStrat * b.co2;

    // Període setembre–juny (índexs 0–6, 8–11 = Gen–Jul, Set–Des → 10 mesos)
    // Set=8, Oct=9, Nov=10, Des=11, Gen=0, Feb=1, Mar=2, Abr=3, Mai=4, Jun=5
    const periodeIdxs = [8,9,10,11,0,1,2,3,4,5]; // Set a Jun
    const periodeStrat = periodeIdxs.reduce((a, i) => a + seas.d[k][i] * mod, 0);

    // Totals
    totalCO2anual += co2Base;
    totalCO2strat += co2Strat;

    const nm = T[S.lang]['kpi_' + k] || b.nom;
    const un = b.un === 'packs' ? T[S.lang].unit_packs : b.un;
    labels.push(nm); baseArr.push(co2Base); stratArr.push(co2Strat);

    // ── KPI cards (mostra valor del període seleccionat) ──
    let periodoUI = 0;
    for (let i = 0; i < S.mesos; i++) periodoUI += seas.d[k][i] * mod;
    document.getElementById('kpi-' + k).textContent = fmt(periodoUI);
    document.getElementById('kpi-' + k + '-a').textContent = fmt(anualStrat) + ' ' + un;

    // ── Indicadors del pla ──
    const piEl = document.getElementById('pi-' + k);
    if (piEl) piEl.textContent = fmt(anualBase) + ' ' + un;

    // ── TAULA 8 CÀLCULS (4 indicadors requerits × 2 = 8, gas és extra) ──
    const isRequired = ['elec','water','paper','clean'].includes(k);
    const num1 = isRequired ? rowNum++ : '—';
    const num2 = isRequired ? rowNum++ : '—';
    tbody.innerHTML += `
      <tr>
        <td style="color:var(--t3);font-weight:700;font-size:.8rem;">${num1} / ${num2}</td>
        <td><strong>${nm}</strong></td>
        <td>${fmt(anualStrat)} <span class="dim">${un}</span></td>
        <td>${fmt(periodeStrat)} <span class="dim">${un}</span></td>
        <td>${b.co2} kg/${un}</td>
        <td class="hi">${fmt(co2Strat, 2)} kg</td>
      </tr>`;

    // ── Export JSON ──
    S.export.Fase1_DataClean_Original[nm] = {
      Valor_Mensual_2024: b.val,
      Unitat: un,
      Factor_Emissio_CO2: b.co2,
      CO2e_Anual_Base_kg: +co2Base.toFixed(2)
    };
    S.export.Fase3_Projeccions.Resultats_Per_Indicador[nm] = {
      Consum_Anual_Estrategia: +anualStrat.toFixed(2),
      Consum_Periode_Set_Jun:  +periodeStrat.toFixed(2),
      CO2e_Anual_kg:           +co2Strat.toFixed(2),
      Reduccio_Aplicada_pct:   Math.round((1 - mod) * 100)
    };
  });

  // ── Target banner ──
  const target30 = totalCO2anual * 0.70;
  document.getElementById('target-val').textContent = fmt(target30) + ' kg CO2e';
  const actives = Object.values(S.mods).filter(v => v < 1).length;
  const pct = Math.min(actives / 5 * 100, 100);
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('prog-pct').textContent  = Math.round(pct) + '%';

  // ── Pla de reducció: targetes resum ──
  const ps = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmt(val); };
  ps('plan-now',    totalCO2anual);
  ps('plan-target', totalCO2anual * 0.70);
  ps('plan-saving', totalCO2anual * 0.30);
  ps('plan-strat',  totalCO2strat);

  // ── JSON preview ──
  S.export.Fase3_Projeccions.Total_CO2e_Anual_Base_kg    = +totalCO2anual.toFixed(2);
  S.export.Fase3_Projeccions.Total_CO2e_Anual_Estrat_kg  = +totalCO2strat.toFixed(2);
  S.export.Fase3_Projeccions.Reduccio_Total_pct           = +((1 - totalCO2strat / totalCO2anual) * 100).toFixed(1);
  document.getElementById('json-pre').textContent = JSON.stringify(S.export, null, 4);

  drawCharts(labels, baseArr, stratArr);
}

/* ── CHARTS ───────────────────────────────────────────────── */
const PAL = ['#4f8ef7','#f5a623','#1ed8a0','#a78bfa','#f472b6'];

function gc() {
  return {
    grid: isLight ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.06)',
    txt:  isLight ? '#4a607c'         : '#7f96b4'
  };
}

function drawCharts(labels, base, strat) {
  const c = gc();
  Chart.defaults.color = c.txt;
  Chart.defaults.font.family = "'Plus Jakarta Sans',sans-serif";

  const pctStrat = strat.map((v, i) => base[i] > 0 ? +((v / base[i]) * 100).toFixed(1) : 100);
  const pctBase  = labels.map(() => 100);

  // RADAR
  if (RC) {
    RC.data.labels = labels;
    RC.data.datasets[1].data = pctStrat;
    RC.update('active');
  } else {
    RC = new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: { labels, datasets: [
        { label: 'Base (100%)', data: pctBase, backgroundColor: 'rgba(248,113,113,.05)', borderColor: 'rgba(248,113,113,.4)', borderDash: [5,5], borderWidth: 1.5, pointRadius: 0 },
        { label: 'Estratègia (%)', data: pctStrat, backgroundColor: 'rgba(30,216,160,.12)', borderColor: '#1ed8a0', borderWidth: 2, pointBackgroundColor: '#1ed8a0', pointRadius: 4, pointHoverRadius: 6 }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, ticks: { stepSize: 25, backdropColor: 'transparent', font: { size: 10 } }, pointLabels: { font: { size: 11, weight: '600' } } } },
        plugins: { legend: { labels: { usePointStyle: true, padding: 16, font: { size: 11 } } } }
      }
    });
  }

  // DOUGHNUT
  if (DC) {
    DC.data.labels = labels;
    DC.data.datasets[0].data = strat;
    DC.update('active');
  } else {
    DC = new Chart(document.getElementById('doughnutChart'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data: strat, backgroundColor: PAL, borderWidth: 0, hoverOffset: 10 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 11 } } } }
      }
    });
  }
}

function drawSeasonal() {
  const c    = gc();
  const seas = seasonal(S.base);
  const opts = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { grid: { color: c.grid }, ticks: { font: { size: 11 } } },
      x: { grid: { color: c.grid }, ticks: { font: { size: 11 } } }
    },
    plugins: { legend: { labels: { usePointStyle: true, padding: 18, font: { size: 11 } } } },
    interaction: { mode: 'index', intersect: false }
  };

  const mkLine = (label, data, color, gl) => ({
    label, data,
    borderColor: color, backgroundColor: gl,
    fill: true, tension: .42, borderWidth: 2,
    pointBackgroundColor: color, pointRadius: 4, pointHoverRadius: 6
  });

  // Chart 1: Gas + Elec
  if (SC1) {
    SC1.data.datasets[0].data = seas.d.gas;
    SC1.data.datasets[1].data = seas.d.elec;
    SC1.update('active');
  } else {
    SC1 = new Chart(document.getElementById('seasonalChart'), {
      type: 'line',
      data: { labels: seas.labels, datasets: [
        mkLine('Gas (kWh)', seas.d.gas, '#f5a623', 'rgba(245,166,35,.08)'),
        mkLine('Electricitat (kWh)', seas.d.elec, '#4f8ef7', 'rgba(79,142,247,.08)')
      ]},
      options: { ...opts }
    });
  }

  // Chart 2: Água + Neteja
  if (SC2) {
    SC2.data.datasets[0].data = seas.d.water;
    SC2.data.datasets[1].data = seas.d.clean;
    SC2.update('active');
  } else {
    SC2 = new Chart(document.getElementById('seasonalChart2'), {
      type: 'line',
      data: { labels: seas.labels, datasets: [
        mkLine('Aigua (m³)', seas.d.water, '#1ed8a0', 'rgba(30,216,160,.08)'),
        mkLine('Prod. Neteja (L)', seas.d.clean, '#f472b6', 'rgba(244,114,182,.08)')
      ]},
      options: { ...opts }
    });
  }
}

function destroyCharts() {
  [RC, DC, SC1, SC2].forEach(ch => { if (ch) ch.destroy(); });
  RC = DC = SC1 = SC2 = null;
}

/* ── DOWNLOAD JSON ────────────────────────────────────────── */
function downloadJSON() {
  const a = document.createElement('a');
  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(S.export, null, 4));
  a.download = 'EcoAudit_Informe_G11_Fase1_Fase3.json';
  a.click();
}

/* ── FORMAT NÚMEROS ───────────────────────────────────────── */
function fmt(n, dec = 0) {
  return (+n || 0).toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/* ── INIT ─────────────────────────────────────────────────── */
window.onload = () => {
  changeLang('ca');
  recalc();
};
