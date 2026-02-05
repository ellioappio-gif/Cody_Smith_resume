const fs = require('fs');
const html = fs.readFileSync('reffie_proposal_FINAL.html', 'utf8');

console.log('=== COMPREHENSIVE WEBSITE AUDIT ===\n');

// 1. Extract all function definitions
const functionDefs = html.match(/window\.\w+\s*=\s*function|function\s+\w+\s*\(/g) || [];
console.log('1. FUNCTIONS DEFINED:', functionDefs.length);
functionDefs.forEach(f => console.log('   -', f.replace(/\s+/g, ' ')));

// 2. Extract all element IDs from HTML
const elementIds = html.match(/id="([^"]+)"/g) || [];
const uniqueIds = [...new Set(elementIds.map(m => m.match(/id="([^"]+)"/)[1]))];
console.log('\n2. ELEMENT IDs IN HTML:', uniqueIds.length);

// 3. Extract all getElementById calls
const getByIdCalls = html.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [];
const idsQueried = [...new Set(getByIdCalls.map(m => m.match(/getElementById\(['"]([^'"]+)['"]\)/)[1]))];
console.log('\n3. getElementById QUERIES:', idsQueried.length);

// 4. Extract all update() calls
const updateCalls = html.match(/update\(['"]([^'"]+)['"]/g) || [];
const idsUpdated = [...new Set(updateCalls.map(m => m.match(/update\(['"]([^'"]+)['"]/)[1]))];
console.log('\n4. ELEMENTS UPDATED VIA update():', idsUpdated.length);

// 5. Extract all setAttr() calls
const setAttrCalls = html.match(/setAttr\(['"]([^'"]+)['"]/g) || [];
const idsSetAttr = [...new Set(setAttrCalls.map(m => m.match(/setAttr\(['"]([^'"]+)['"]/)[1]))];
console.log('\n5. ELEMENTS MODIFIED VIA setAttr():', idsSetAttr.length);

// 6. Cross-reference: Find IDs that are updated but don't exist
const allUpdatedIds = [...new Set([...idsUpdated, ...idsSetAttr])];
const missingIds = allUpdatedIds.filter(id => !uniqueIds.includes(id));
console.log('\n6. MISSING ELEMENT IDs:', missingIds.length);
if (missingIds.length > 0) {
  console.log('   ⚠️  WARNING: These IDs are updated but not in HTML:');
  missingIds.forEach(id => console.log('      ❌', id));
}

// 7. Event listeners
const addEventListenerCalls = html.match(/addEventListener\(['"]([^'"]+)['"]/g) || [];
console.log('\n7. EVENT LISTENERS:', addEventListenerCalls.length);
addEventListenerCalls.forEach(e => console.log('   -', e));

// 8. Data attributes
const dataAttrs = html.match(/data-[a-z-]+="[^"]+"/g) || [];
const uniqueDataAttrs = [...new Set(dataAttrs.map(d => d.split('=')[0]))];
console.log('\n8. DATA ATTRIBUTES:', uniqueDataAttrs.length);
uniqueDataAttrs.forEach(d => console.log('   -', d));

// 9. Console statements
const consoleCalls = html.match(/console\.\w+\(/g) || [];
const consoleTypes = {};
consoleCalls.forEach(c => {
  const type = c.match(/console\.(\w+)/)[1];
  consoleTypes[type] = (consoleTypes[type] || 0) + 1;
});
console.log('\n9. CONSOLE STATEMENTS:', consoleCalls.length);
Object.keys(consoleTypes).forEach(type => console.log('   -', type + ':', consoleTypes[type]));

// 10. State variables
const stateVars = html.match(/var\s+(calc|aeSalary|sprintData)\s*=/g) || [];
console.log('\n10. STATE VARIABLES:', stateVars.length);
stateVars.forEach(v => console.log('   -', v.replace(/\s+/g, ' ')));

console.log('\n=== VALIDATION SUMMARY ===');
console.log('✓ Total HTML elements:', uniqueIds.length);
console.log('✓ Elements being updated:', allUpdatedIds.length);
console.log(missingIds.length === 0 ? '✅ All updated elements exist!' : '❌ Missing elements found!');
console.log('✓ Event listeners attached:', addEventListenerCalls.length);
console.log('✓ Functions defined:', functionDefs.length);

