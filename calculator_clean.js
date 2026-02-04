// =============================================================================
// CALCULATOR - CLEAN BULLETPROOF IMPLEMENTATION
// =============================================================================

// Calculator state
var calcState = {
    avgDealSize: 6000,
    salesCycle: 45,
    winRate: 20,
    callsPerDay: 6
};

// Update slider background fill
function updateSliderBg(sliderId, min, max, color) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;
    
    var value = parseFloat(slider.value);
    var percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = 'linear-gradient(to right, ' + color + ' 0%, ' + color + ' ' + percentage + '%, #E2E8F0 ' + percentage + '%, #E2E8F0 100%)';
}

// Slider event handlers
function handleDealSizeChange(value) {
    var val = parseFloat(value);
    calcState.avgDealSize = val * 1000;
    document.getElementById('dealSizeValue').textContent = '$' + val + 'K';
    updateSliderBg('sliderDealSize', 1, 50, '#10B981');
    calculateAndDisplay();
}

function handleSalesCycleChange(value) {
    var val = parseFloat(value);
    calcState.salesCycle = val;
    document.getElementById('salesCycleValue').textContent = val + 'd';
    updateSliderBg('sliderSalesCycle', 7, 120, '#06B6D4');
    calculateAndDisplay();
}

function handleWinRateChange(value) {
    var val = parseFloat(value);
    calcState.winRate = val;
    document.getElementById('winRateValue').textContent = val + '%';
    updateSliderBg('sliderWinRate', 5, 100, '#8B5CF6');
    calculateAndDisplay();
}

function handleCallsPerDayChange(value) {
    var val = parseFloat(value);
    calcState.callsPerDay = val;
    document.getElementById('callsPerDayValue').textContent = val + '/day';
    updateSliderBg('sliderCallsPerDay', 1, 30, '#F59E0B');
    calculateAndDisplay();
}

// Main calculation and display function
function calculateAndDisplay() {
    var s = calcState;
    
    // Constants
    var workDays = 20;
    var conversionRate = 0.12;
    
    // Productivity ramp (conservative)
    var prod1 = 0.30;
    var prod2 = 0.50;
    var prod3 = 0.70;
    
    // Month 1 calculations
    var m1Calls = s.callsPerDay * workDays * prod1;
    var m1Opps = m1Calls * conversionRate;
    var m1Deals = m1Opps * (s.winRate / 100);
    var m1Revenue = m1Deals * s.avgDealSize;
    var m1Pipeline = m1Opps * s.avgDealSize;
    
    // Month 2 calculations
    var m2Calls = s.callsPerDay * workDays * prod2;
    var m2Opps = m2Calls * conversionRate;
    var m2Deals = m2Opps * (s.winRate / 100);
    var m2Revenue = m2Deals * s.avgDealSize;
    var m2Pipeline = m2Opps * s.avgDealSize;
    
    // Month 3 calculations
    var m3Calls = s.callsPerDay * workDays * prod3;
    var m3Opps = m3Calls * conversionRate;
    var m3Deals = m3Opps * (s.winRate / 100);
    var m3Revenue = m3Deals * s.avgDealSize;
    var m3Pipeline = m3Opps * s.avgDealSize;
    
    // Sales cycle adjustments (revenue timing)
    var cycleMonths = s.salesCycle / 30;
    var closed1, closed2, closed3;
    
    if (cycleMonths <= 1.5) {
        // Short cycle - close same month
        closed1 = m1Revenue;
        closed2 = m2Revenue;
        closed3 = m3Revenue;
    } else if (cycleMonths <= 2.5) {
        // Medium cycle - split across months
        closed1 = m1Revenue * 0.3;
        closed2 = m1Revenue * 0.7 + m2Revenue * 0.3;
        closed3 = m2Revenue * 0.7 + m3Revenue * 0.3;
    } else {
        // Long cycle - delayed closes
        closed1 = 0;
        closed2 = m1Revenue * 0.4;
        closed3 = m1Revenue * 0.6 + m2Revenue * 0.3;
    }
    
    // Total metrics
    var totalRevenue = closed1 + closed2 + closed3;
    var totalPipeline = m1Pipeline + m2Pipeline + m3Pipeline;
    var totalDeals = totalRevenue / s.avgDealSize;
    var pipelineDeals = totalPipeline / s.avgDealSize;
    
    // Format currency
    function fmt(num) {
        return '$' + Math.round(num / 1000) + 'K';
    }
    
    // Update main metrics
    setText('closedRevenue', fmt(totalRevenue));
    setText('totalPipeline', fmt(totalPipeline));
    setText('closedDeals', Math.round(totalDeals));
    setText('pipelineDeals', Math.round(pipelineDeals));
    
    // Update month breakdowns
    setText('month1Revenue', fmt(closed1));
    setText('month1Pipeline', fmt(m1Pipeline));
    setText('month2Revenue', fmt(closed2));
    setText('month2Pipeline', fmt(m2Pipeline));
    setText('month3Revenue', fmt(closed3));
    setText('month3Pipeline', fmt(m3Pipeline));
    
    // Update 90-day plan cards
    setText('planM1Rev', fmt(closed1));
    setText('planM1Pipe', fmt(m1Pipeline));
    setText('planM1Deals', '(' + Math.round(m1Deals * 0.4) + '-' + Math.round(m1Deals * 0.6) + ' deals)');
    setText('planM1Opps', '(' + Math.round(m1Opps * 0.7) + '-' + Math.round(m1Opps) + ' opps)');
    
    setText('planM2Rev', fmt(closed2));
    setText('planM2Pipe', fmt(m2Pipeline));
    setText('planM2Deals', '(' + Math.round(m2Deals * 0.6) + '-' + Math.round(m2Deals * 1.2) + ' deals)');
    setText('planM2Opps', '(' + Math.round(m2Opps * 0.7) + '-' + Math.round(m2Opps) + ' opps)');
    
    setText('planM3Rev', fmt(closed3));
    setText('planM3Pipe', fmt(m3Pipeline));
    setText('planM3Deals', '(' + Math.round(m3Deals * 0.8) + '-' + Math.round(m3Deals * 1.3) + ' deals)');
    setText('planM3Opps', '(' + Math.round(m3Opps * 0.8) + '-' + Math.round(m3Opps * 1.2) + ' opps)');
    
    // Update cycle days display
    setText('planCycleDays1', Math.round(s.salesCycle / 2) + '-' + Math.round(s.salesCycle));
    
    // Update CTA section
    setText('ctaRevenue', fmt(totalRevenue));
    setText('ctaPipeline', fmt(totalPipeline));
    
    // Update revenue chart
    updateChart(closed1, closed2, closed3, m1Pipeline, m2Pipeline, m3Pipeline);
}

// Helper to set text content safely
function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

// Update revenue chart
function updateChart(m1Rev, m2Rev, m3Rev, m1Pipe, m2Pipe, m3Pipe) {
    // Cumulative values
    var cumRev1 = m1Rev;
    var cumRev2 = m1Rev + m2Rev;
    var cumRev3 = m1Rev + m2Rev + m3Rev;
    
    var cumPipe1 = m1Pipe;
    var cumPipe2 = m1Pipe + m2Pipe;
    var cumPipe3 = m1Pipe + m2Pipe + m3Pipe;
    
    // Find max value for scaling
    var maxVal = Math.max(cumRev1, cumRev2, cumRev3, cumPipe1, cumPipe2, cumPipe3, 1);
    var chartMax = maxVal * 1.15;
    
    // Format currency
    function fmt(num) {
        return '$' + Math.round(num / 1000) + 'K';
    }
    
    // Update Y-axis
    setText('chartY6', fmt(chartMax));
    setText('chartY5', fmt(chartMax * 0.8));
    setText('chartY4', fmt(chartMax * 0.6));
    setText('chartY3', fmt(chartMax * 0.4));
    setText('chartY2', fmt(chartMax * 0.2));
    setText('chartY1', '$0');
    
    // Calculate Y positions (chart is 270px tall, starting at y=50)
    function yPos(val) {
        return 320 - ((val / chartMax) * 270);
    }
    
    var revY1 = yPos(cumRev1);
    var revY2 = yPos(cumRev2);
    var revY3 = yPos(cumRev3);
    
    var pipeY1 = yPos(cumPipe1);
    var pipeY2 = yPos(cumPipe2);
    var pipeY3 = yPos(cumPipe3);
    
    // Update revenue line
    var revLine = document.getElementById('revenueLine');
    if (revLine) {
        revLine.setAttribute('d', 'M 250 ' + revY1 + ' L 465 ' + revY2 + ' L 680 ' + revY3);
    }
    
    // Update revenue points
    setAttr('revPoint1', 'cy', revY1);
    setAttr('revPoint2', 'cy', revY2);
    setAttr('revPoint3', 'cy', revY3);
    
    // Update pipeline line
    var pipeLine = document.getElementById('pipelineLine');
    if (pipeLine) {
        pipeLine.setAttribute('d', 'M 250 ' + pipeY1 + ' L 465 ' + pipeY2 + ' L 680 ' + pipeY3);
    }
    
    // Update pipeline points
    setAttr('pipePoint1', 'cy', pipeY1);
    setAttr('pipePoint2', 'cy', pipeY2);
    setAttr('pipePoint3', 'cy', pipeY3);
    
    // Update labels
    setText('revLabel1', fmt(cumRev1));
    setText('revLabel2', fmt(cumRev2));
    setText('revLabel3', fmt(cumRev3));
    setText('pipeLabel1', fmt(cumPipe1));
    setText('pipeLabel2', fmt(cumPipe2));
    setText('pipeLabel3', fmt(cumPipe3));
    
    // Position labels
    setAttr('revLabel1', 'y', Math.max(30, revY1 - 15));
    setAttr('revLabel2', 'y', Math.max(30, revY2 - 15));
    setAttr('revLabel3', 'y', Math.max(30, revY3 - 15));
    setAttr('pipeLabel1', 'y', Math.min(350, pipeY1 + 25));
    setAttr('pipeLabel2', 'y', Math.min(350, pipeY2 + 25));
    setAttr('pipeLabel3', 'y', Math.min(350, pipeY3 + 25));
}

// Helper to set attribute
function setAttr(id, attr, value) {
    var el = document.getElementById(id);
    if (el) {
        el.setAttribute(attr, value);
    }
}

// =============================================================================
// SPRINT COST COMPARISON
// =============================================================================

var sprintAeSalary = 120000;

function handleAeCompChange(value) {
    var val = parseFloat(value);
    sprintAeSalary = val * 1000;
    document.getElementById('aeSalaryValue').textContent = '$' + val + 'K';
    updateSliderBg('sliderAeComp', 80, 180, '#10B981');
    updateSprintComparison();
}

function updateSprintComparison() {
    var salary = sprintAeSalary;
    
    // Traditional hiring costs
    var tradSalary = salary;
    var tradRecruiting = salary * 0.20;
    var tradLostRevenue = 30000 * 6;
    var tradCEOTime = 80000;
    var tradSubtotal = tradSalary + tradRecruiting + tradLostRevenue + tradCEOTime;
    var tradRisk = tradSubtotal * 0.73 * 0.40;
    var tradTotal = tradSubtotal + tradRisk;
    
    // Sprint method costs
    var sprintCost = 15000;
    var sprintSalary = salary * 0.70;
    var sprintRecruiting = sprintSalary * 0.20;
    var sprintLostRevenue = 30000 * 2;
    var sprintCEOTime = 16000;
    var sprintSubtotal = sprintCost + sprintSalary + sprintRecruiting + sprintLostRevenue + sprintCEOTime;
    var sprintRisk = sprintSubtotal * 0.22 * 0.40;
    var sprintTotal = sprintSubtotal + sprintRisk;
    
    // Savings
    var savings = tradTotal - sprintTotal;
    var savingsPct = (savings / tradTotal) * 100;
    
    // Format currency
    function fmt(num) {
        return '$' + Math.round(num / 1000) + 'K';
    }
    
    // Update traditional costs
    setText('tradSalary', fmt(tradSalary));
    setText('tradRecruiting', fmt(tradRecruiting));
    setText('tradLostRev', fmt(tradLostRevenue));
    setText('tradCEO', fmt(tradCEOTime));
    setText('tradSubtotal', fmt(tradSubtotal));
    setText('tradRisk', fmt(tradRisk));
    setText('tradTotal', fmt(tradTotal));
    
    // Update sprint costs
    setText('sprintCost', '$15K');
    setText('sprintSalary', fmt(sprintSalary));
    setText('sprintRecruiting', fmt(sprintRecruiting));
    setText('sprintLostRev', fmt(sprintLostRevenue));
    setText('sprintCEO', fmt(sprintCEOTime));
    setText('sprintSubtotal', fmt(sprintSubtotal));
    setText('sprintRisk', fmt(sprintRisk));
    setText('sprintTotal', fmt(sprintTotal));
    
    // Update savings
    setText('sprintSavings', fmt(savings));
    setText('sprintSavingsPct', Math.round(savingsPct) + '%');
}

// Sprint duration selector
var selectedSprintDuration = 30;

function selectSprintDuration(days) {
    selectedSprintDuration = days;
    
    // Update button states
    var buttons = document.querySelectorAll('[onclick^="selectSprintDuration"]');
    for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (btn.textContent.indexOf(days + ' Days') !== -1) {
            btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            btn.style.color = 'white';
        } else {
            btn.style.background = 'white';
            btn.style.color = '#64748B';
        }
    }
    
    // Update sprint details based on duration
    var costPerDay = selectedSprintDuration === 14 ? 1071 : 
                     selectedSprintDuration === 30 ? 500 : 395;
    
    setText('sprintCostPerDay', '$' + costPerDay + '/day');
    setText('sprintTotalCost', '$' + (costPerDay * selectedSprintDuration / 1000) + 'K');
}

// =============================================================================
// NAVIGATION & UI
// =============================================================================

function initNavigationTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // Update active link on scroll
    function updateActiveLink() {
        var current = '';
        
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionTop = section.offsetTop;
            var sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        }
        
        for (var j = 0; j < navLinks.length; j++) {
            var link = navLinks[j];
            link.classList.remove('active');
            
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

function initExpandableSections() {
    var expandableSections = document.querySelectorAll('[data-expandable]');
    
    for (var i = 0; i < expandableSections.length; i++) {
        var section = expandableSections[i];
        var header = section.querySelector('[data-toggle]');
        var content = section.querySelector('[data-content]');
        
        if (header && content) {
            header.classList.add('section-toggle');
            content.classList.add('section-content');
            
            var isExpanded = section.getAttribute('data-expanded') === 'true';
            if (isExpanded) {
                header.classList.add('expanded');
                content.classList.add('expanded');
            }
            
            header.addEventListener('click', function() {
                var hdr = this;
                var sec = hdr.closest('[data-expandable]');
                var cnt = sec.querySelector('[data-content]');
                
                hdr.classList.toggle('expanded');
                cnt.classList.toggle('expanded');
                
                var nowExpanded = hdr.classList.contains('expanded');
                sec.setAttribute('data-expanded', nowExpanded);
                
                if (nowExpanded) {
                    setTimeout(function() {
                        hdr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            });
        }
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

function initializeApp() {
    console.log('Initializing application...');
    
    // Run initial calculations
    calculateAndDisplay();
    updateSprintComparison();
    
    // Initialize sliders backgrounds
    updateSliderBg('sliderDealSize', 1, 50, '#10B981');
    updateSliderBg('sliderSalesCycle', 7, 120, '#06B6D4');
    updateSliderBg('sliderWinRate', 5, 100, '#8B5CF6');
    updateSliderBg('sliderCallsPerDay', 1, 30, '#F59E0B');
    updateSliderBg('sliderAeComp', 80, 180, '#10B981');
    
    // Initialize UI
    initNavigationTracking();
    initExpandableSections();
    selectSprintDuration(30);
    
    console.log('Application initialized successfully');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
