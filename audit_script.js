// COMPREHENSIVE CALCULATOR AUDIT SCRIPT
// Open browser console and paste this script to run full diagnostics

console.log('========================================');
console.log('CALCULATOR COMPREHENSIVE AUDIT');
console.log('========================================\n');

// Test 1: Check Calculator object
console.log('1. CALCULATOR OBJECT:');
console.log('   Exists:', typeof window.Calculator);
console.log('   State:', window.Calculator ? window.Calculator.state : 'N/A');
console.log('   Results:', window.Calculator ? window.Calculator.results : 'N/A');

// Test 2: Check all required methods
console.log('\n2. CALCULATOR METHODS:');
const methods = ['update', 'calculate', 'display', 'setText', 'updateChart'];
methods.forEach(method => {
    const exists = window.Calculator && typeof window.Calculator[method] === 'function';
    console.log(`   ${method}():`, exists ? '✓ EXISTS' : '✗ MISSING');
});

// Test 3: Check all HTML elements for sliders
console.log('\n3. SLIDER ELEMENTS:');
const sliders = [
    'sliderDealSize',
    'sliderSalesCycle',
    'sliderWinRate',
    'sliderCallsPerDay'
];
sliders.forEach(id => {
    const el = document.getElementById(id);
    console.log(`   ${id}:`, el ? `✓ FOUND (value: ${el.value})` : '✗ NOT FOUND');
});

// Test 4: Check slider value displays
console.log('\n4. SLIDER VALUE DISPLAYS:');
const displays = [
    'dealSizeValue',
    'salesCycleValue',
    'winRateValue',
    'callsPerDayValue'
];
displays.forEach(id => {
    const el = document.getElementById(id);
    console.log(`   ${id}:`, el ? `✓ FOUND (text: "${el.textContent}")` : '✗ NOT FOUND');
});

// Test 5: Check result elements
console.log('\n5. RESULT DISPLAY ELEMENTS:');
const results = [
    'closedRevenue',
    'totalPipeline',
    'closedDeals',
    'pipelineDeals',
    'month1Revenue',
    'month2Revenue',
    'month3Revenue'
];
results.forEach(id => {
    const el = document.getElementById(id);
    console.log(`   ${id}:`, el ? `✓ FOUND (text: "${el.textContent}")` : '✗ NOT FOUND');
});

// Test 6: Check chart elements
console.log('\n6. CHART ELEMENTS:');
const chartEls = [
    'chartY1', 'chartY2', 'chartY3', 'chartY4', 'chartY5', 'chartY6',
    'revenueLine', 'pipelineLine',
    'revPoint1', 'revPoint2', 'revPoint3',
    'pipePoint1', 'pipePoint2', 'pipePoint3'
];
chartEls.forEach(id => {
    const el = document.getElementById(id);
    console.log(`   ${id}:`, el ? '✓ FOUND' : '✗ NOT FOUND');
});

// Test 7: Run calculation test
console.log('\n7. CALCULATION TEST:');
try {
    const beforeState = JSON.parse(JSON.stringify(window.Calculator.state));
    console.log('   Before:', beforeState);
    
    window.Calculator.calculate();
    console.log('   ✓ calculate() executed');
    
    const results = window.Calculator.results;
    console.log('   Total Revenue:', results.totalRevenue);
    console.log('   Total Pipeline:', results.totalPipeline);
    
    if (results.totalRevenue > 0) {
        console.log('   ✓ Calculator producing valid results');
    } else {
        console.log('   ✗ Calculator not calculating properly');
    }
} catch(e) {
    console.error('   ✗ Error during calculation:', e.message);
}

// Test 8: Test display update
console.log('\n8. DISPLAY UPDATE TEST:');
try {
    window.Calculator.display();
    console.log('   ✓ display() executed');
    
    const closedRevEl = document.getElementById('closedRevenue');
    if (closedRevEl) {
        console.log('   closedRevenue text:', closedRevEl.textContent);
        if (closedRevEl.textContent === '$0' || closedRevEl.textContent === '$42,000') {
            console.log('   ⚠ WARNING: closedRevenue still shows initial value');
        } else {
            console.log('   ✓ closedRevenue updated successfully');
        }
    }
} catch(e) {
    console.error('   ✗ Error during display:', e.message);
}

// Test 9: Test slider interaction
console.log('\n9. SLIDER HANDLER TEST:');
const dealSlider = document.getElementById('sliderDealSize');
if (dealSlider && dealSlider.oninput) {
    console.log('   ✓ Deal Size slider has oninput handler');
} else if (dealSlider) {
    console.log('   ✗ Deal Size slider missing oninput handler');
} else {
    console.log('   ✗ Deal Size slider not found');
}

// Test 10: Manual trigger test
console.log('\n10. MANUAL TRIGGER TEST:');
console.log('   Attempting to update avgDealSize to 10000...');
try {
    window.Calculator.update('avgDealSize', 10000);
    const newValue = window.Calculator.state.avgDealSize;
    console.log('   New avgDealSize:', newValue);
    
    const closedRevEl = document.getElementById('closedRevenue');
    if (closedRevEl) {
        console.log('   Displayed closedRevenue:', closedRevEl.textContent);
    }
    
    if (newValue === 10000) {
        console.log('   ✓ State updated correctly');
    } else {
        console.log('   ✗ State not updated');
    }
} catch(e) {
    console.error('   ✗ Error:', e.message);
}

console.log('\n========================================');
console.log('AUDIT COMPLETE');
console.log('========================================');
console.log('\nTo test reactivity, move the sliders and watch the console for updates.');
