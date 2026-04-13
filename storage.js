const fs = require('fs');
const path = require('path');

const CHECKS_FILE = path.join(__dirname, 'checks.json');

if (!fs.existsSync(CHECKS_FILE)) {
    fs.writeFileSync(CHECKS_FILE, JSON.stringify([]));
}

function getChecks() {
    try {
        const data = fs.readFileSync(CHECKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading checks file:', error);
        return [];
    }
}

function addCheck(check) {
    let checks = getChecks();
    checks.unshift(check);
    if (checks.length > 10) {
        checks = checks.slice(0, 10);
    }
    fs.writeFileSync(CHECKS_FILE, JSON.stringify(checks, null, 2));
    return checks;
}

module.exports = {
    getChecks,
    addCheck
};
