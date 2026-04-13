const fs = require('fs');
const path = require('path');

const CHECKS_FILE = path.join(__dirname, 'checks.json');

function validateFailedChecks() {
    try {
        const data = fs.readFileSync(CHECKS_FILE, 'utf8');
        const checks = JSON.parse(data);
        
        const failedChecks = checks.filter(c => !c.ok);
        if (failedChecks.length === 0) {
            console.log('No failed checks found. Everything is operational.');
            return;
        }

        console.log(`Found ${failedChecks.length} failed checks. Initializing Agentic Validation...`);
        failedChecks.forEach(check => {
            console.log('\n--- AGENTIC VALIDATION INSTRUCTION ---');
            console.log(`Target URL: ${check.url}`);
            console.log(`Instruction for Antigravity Browser Subagent:`);
            const searchQuery = encodeURIComponent(check.url + ' api status docs');
            console.log(`TASK: Visit https://www.google.com/search?q=${searchQuery}`);
            console.log(`Identify the official documentation or status page for this API and confirm whether the service is officially 'operational' or if an outage is heavily reported.`);
            console.log('Output your findings.');
            console.log('--------------------------------------\n');
        });
    } catch (error) {
        console.error('Error reading checks file:', error);
    }
}

validateFailedChecks();
