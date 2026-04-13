document.addEventListener('DOMContentLoaded', () => {
    const checkForm = document.getElementById('checkForm');
    const urlInput = document.getElementById('url');
    const submitBtn = document.getElementById('submitBtn');
    const latestResultContainer = document.getElementById('latestResult');
    const historyList = document.getElementById('historyList');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Fetch initial history
    fetchHistory();

    checkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();
        if (!url) return;

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        loadingIndicator.classList.remove('hidden');
        latestResultContainer.classList.add('hidden');

        try {
            const response = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await response.json();
            
            renderLatestResult(data);
            fetchHistory(); // Refresh history
        } catch (error) {
            console.error('Error fetching check API:', error);
            renderLatestResult({ error: 'Failed to contact Sentinel API', ok: false, url });
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            loadingIndicator.classList.add('hidden');
            latestResultContainer.classList.remove('hidden');
        }
    });

    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            renderHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    }

    function renderLatestResult(data) {
        let statusHtml = '';
        const isUp = data.ok;
        const statusClass = isUp ? 'glow-green bg-green-900/20' : 'glow-red bg-red-900/20';
        const statusText = isUp ? 'OPERATIONAL' : 'SYSTEM FAILURE';
        
        statusHtml = `
            <div class="border p-4 rounded ${statusClass} transition-all duration-500">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs uppercase tracking-widest opacity-80">STATUS</span>
                    <span class="font-bold text-sm tracking-widest">${statusText}</span>
                </div>
                <div class="text-sm truncate mb-2 opacity-90">${data.url}</div>
                <div class="flex justify-between items-end border-t border-current pt-2 opacity-80 mt-2">
                    <span class="text-xs uppercase">LATENCY</span>
                    <span class="font-mono">${data.latency !== undefined ? data.latency + 'ms' : 'N/A'}</span>
                </div>
            </div>
        `;
        latestResultContainer.innerHTML = statusHtml;
    }

    function renderHistory(logs) {
        if (logs.length === 0) {
            historyList.innerHTML = '<div class="text-slate-500 text-sm text-center py-4 italic">No telemetry data available.</div>';
            return;
        }

        historyList.innerHTML = logs.map(log => {
            const isUp = log.ok;
            const logClass = isUp ? 'text-green-400 border-green-900' : 'text-red-400 border-red-900';
            const logBg = isUp ? 'bg-green-900/10' : 'bg-red-900/10';
            const time = new Date(log.timestamp).toLocaleTimeString();
            
            return `
                <div class="border-l-2 p-2 rounded-r flex flex-col ${logClass} ${logBg}">
                    <div class="flex justify-between text-xs opacity-70 mb-1">
                        <span>${time}</span>
                        <span>${log.latency !== undefined ? log.latency + 'ms' : 'N/A'}</span>
                    </div>
                    <div class="text-xs truncate flex-1" title="${log.url}">${log.url}</div>
                    <div class="text-[10px] uppercase font-bold mt-1 opacity-90">${isUp ? 'OK ' + log.status : 'ERR ' + (log.error || log.status)}</div>
                </div>
            `;
        }).join('');
    }
});
