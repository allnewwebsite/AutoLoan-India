// ============ Admin Panel Script ============

let selectedLeadId = null;
let allLeads = [];
let database = null;
let usingFirebase = false;

const firebaseConfig = {
    apiKey: "AIzaSyA_bthyCY_P3dVMudQKEDxroGh3VO-M68A",
    authDomain: "autoloan-india.firebaseapp.com",
    databaseURL: "https://autoloan-india-default-rtdb.firebaseio.com",
    projectId: "autoloan-india",
    storageBucket: "autoloan-india.firebasestorage.app",
    messagingSenderId: "700809496368",
    appId: "1:700809496368:web:cf5a007b4d4d2bab5b2af5"
};

// ============ Initialize Admin Panel ============
document.addEventListener('DOMContentLoaded', function() {
    // Display logged-in username
    const username = localStorage.getItem('adminUsername') || 'Admin';
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg) {
        welcomeMsg.textContent = 'Welcome, ' + username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    initFirebase();
    loadLeads();
    updateDashboard();
    console.log('%cAutoLoan Admin Panel Loaded', 'color: #003d99; font-size: 16px; font-weight: bold;');
});

function initFirebase() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        database = firebase.database();
        usingFirebase = true;
        subscribeToFirebaseLeads();
        console.log('Admin connected to Firebase');
    } catch (error) {
        usingFirebase = false;
        console.log('Firebase not available in admin, using localStorage');
    }
}

function subscribeToFirebaseLeads() {
    if (!database) return;

    database.ref('leads').on('value', function(snapshot) {
        const data = snapshot.val() || {};
        allLeads = Object.entries(data).map(([key, lead]) => ({
            ...lead,
            leadId: lead?.leadId || key
        }));

        localStorage.setItem('carLoanLeads', JSON.stringify(allLeads));
        updateDashboard();

        if (document.getElementById('leads-section').style.display === 'block') {
            displayLeadsTable();
        }
        if (document.getElementById('stats-section').style.display === 'block') {
            updateStatistics();
        }
    });
}

// ============ Load Leads from localStorage ============
function loadLeads() {
    if (usingFirebase) {
        return;
    }

    try {
        const data = localStorage.getItem('carLoanLeads');
        allLeads = data ? JSON.parse(data) : [];
        console.log('Loaded ' + allLeads.length + ' leads');
    } catch (error) {
        console.error('Error loading leads:', error);
        allLeads = [];
    }
}

// ============ Update Dashboard ============
function updateDashboard() {
    if (!usingFirebase) {
        loadLeads();
    }
    
    // Calculate statistics
    const totalLeads = allLeads.length;
    const todayLeads = getTodayLeads();
    const monthLeads = getMonthLeads();
    const cities = [...new Set(allLeads.map(lead => lead.city))].length;
    
    // Update stat cards
    document.getElementById('total-leads').textContent = totalLeads;
    document.getElementById('today-leads').textContent = todayLeads;
    document.getElementById('month-leads').textContent = monthLeads;
    document.getElementById('cities-count').textContent = cities;
    
    // Update popular banks
    updatePopularBanks();
    
    // Update popular cities
    updatePopularCities();
    
    // Update recent leads table
    updateRecentLeads();
}

// ============ Get Today's Leads ============
function getTodayLeads() {
    const today = new Date().toLocaleDateString('en-IN');
    return allLeads.filter(lead => {
        if (!lead.timestamp) return false;
        return lead.timestamp.includes(today);
    }).length;
}

// ============ Get This Month's Leads ============
function getMonthLeads() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    return allLeads.filter(lead => {
        if (!lead.timestamp) return false;
        const leadDate = new Date(lead.timestamp);
        return leadDate.getMonth() === month && leadDate.getFullYear() === year;
    }).length;
}

// ============ Update Popular Banks ============
function updatePopularBanks() {
    const bankCounts = {};
    
    allLeads.forEach(lead => {
        const bank = lead.preferredBank || 'Unknown';
        bankCounts[bank] = (bankCounts[bank] || 0) + 1;
    });
    
    const sorted = Object.entries(bankCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const html = sorted.length === 0 
        ? '<p style="text-align: center; color: #999;">No leads yet</p>'
        : sorted.map(([bank, count]) => `
            <div class="popular-item">
                <span class="popular-item-name">${bank}</span>
                <span class="popular-item-count">${count}</span>
            </div>
        `).join('');
    
    document.getElementById('popular-banks').innerHTML = html;
}

// ============ Update Popular Cities ============
function updatePopularCities() {
    const cityCounts = {};
    
    allLeads.forEach(lead => {
        const city = lead.city || 'Unknown';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    const sorted = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const html = sorted.length === 0 
        ? '<p style="text-align: center; color: #999;">No leads yet</p>'
        : sorted.map(([city, count]) => `
            <div class="popular-item">
                <span class="popular-item-name">${city}</span>
                <span class="popular-item-count">${count}</span>
            </div>
        `).join('');
    
    document.getElementById('popular-cities').innerHTML = html;
}

// ============ Update Recent Leads Table ============
function updateRecentLeads() {
    const recent = allLeads.slice(-5).reverse();
    
    if (recent.length === 0) {
        document.getElementById('recent-leads-table').innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">No leads yet</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Bank</th>
                    <th>Loan Amount</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${recent.map(lead => `
                    <tr>
                        <td><a onclick="viewLead('${lead.leadId}')">${lead.fullName}</a></td>
                        <td>${lead.mobileNumber}</td>
                        <td>${lead.city}</td>
                        <td>${lead.preferredBank}</td>
                        <td>₹${formatAmount(lead.loanAmount)}</td>
                        <td>${lead.timestamp}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('recent-leads-table').innerHTML = html;
}

// ============ Format Amount ============
function formatAmount(amount) {
    return parseFloat(amount).toLocaleString('en-IN');
}

// ============ Show Dashboard ============
function showDashboard() {
    setActiveNav('dashboard');
    document.getElementById('page-title').textContent = 'Dashboard';
    
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('leads-section').style.display = 'none';
    document.getElementById('stats-section').style.display = 'none';
    document.getElementById('tools-section').style.display = 'none';
    
    updateDashboard();
}

// ============ Show Leads ============
function showLeads() {
    setActiveNav('leads');
    document.getElementById('page-title').textContent = 'All Leads';
    
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('leads-section').style.display = 'block';
    document.getElementById('stats-section').style.display = 'none';
    document.getElementById('tools-section').style.display = 'none';
    
    displayLeadsTable();
}

// ============ Display Leads Table ============
function displayLeadsTable() {
    loadLeads();
    
    if (allLeads.length === 0) {
        document.getElementById('leads-table').innerHTML = '<p style="text-align: center; padding: 40px; background: white; border-radius: 8px; color: #999;">No leads found</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Car Type</th>
                    <th>Bank</th>
                    <th>Loan Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allLeads.map((lead, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><a onclick="viewLead('${lead.leadId}')">${lead.fullName}</a></td>
                        <td><a href="tel:${lead.mobileNumber}">${lead.mobileNumber}</a></td>
                        <td>${lead.city}</td>
                        <td>${lead.carType}</td>
                        <td>${lead.preferredBank}</td>
                        <td>₹${formatAmount(lead.loanAmount)}</td>
                        <td>${lead.timestamp}</td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="viewLead('${lead.leadId}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('leads-table').innerHTML = html;
}

// ============ Filter Leads ============
function filterLeads() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    const filtered = allLeads.filter(lead => 
        lead.fullName.toLowerCase().includes(searchTerm) ||
        lead.mobileNumber.includes(searchTerm) ||
        lead.city.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        document.getElementById('leads-table').innerHTML = '<p style="text-align: center; padding: 40px; background: white; border-radius: 8px; color: #999;">No leads match your search</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Car Type</th>
                    <th>Bank</th>
                    <th>Loan Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map((lead, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><a onclick="viewLead('${lead.leadId}')">${lead.fullName}</a></td>
                        <td><a href="tel:${lead.mobileNumber}">${lead.mobileNumber}</a></td>
                        <td>${lead.city}</td>
                        <td>${lead.carType}</td>
                        <td>${lead.preferredBank}</td>
                        <td>₹${formatAmount(lead.loanAmount)}</td>
                        <td>${lead.timestamp}</td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="viewLead('${lead.leadId}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('leads-table').innerHTML = html;
}

// ============ View Lead Details ============
function viewLead(leadId) {
    const lead = allLeads.find(l => l.leadId === leadId);
    
    if (!lead) {
        alert('Lead not found');
        return;
    }
    
    selectedLeadId = leadId;
    
    const detailsHtml = `
        <div class="detail-row">
            <div class="detail-label">Lead ID:</div>
            <div class="detail-value">${lead.leadId}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Full Name:</div>
            <div class="detail-value">${lead.fullName}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Mobile Number:</div>
            <div class="detail-value"><a href="tel:${lead.mobileNumber}">${lead.mobileNumber}</a></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">City:</div>
            <div class="detail-value">${lead.city}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Employment Type:</div>
            <div class="detail-value">${lead.employmentType}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Car Type:</div>
            <div class="detail-value">${lead.carType}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Car Price:</div>
            <div class="detail-value">₹${formatAmount(lead.carPrice)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Loan Amount:</div>
            <div class="detail-value">₹${formatAmount(lead.loanAmount)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Preferred Bank:</div>
            <div class="detail-value">${lead.preferredBank}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Submitted On:</div>
            <div class="detail-value">${lead.timestamp}</div>
        </div>
    `;
    
    document.getElementById('lead-details').innerHTML = detailsHtml;
    document.getElementById('lead-modal').style.display = 'block';
}

// ============ Close Lead Modal ============
function closeLead() {
    document.getElementById('lead-modal').style.display = 'none';
    selectedLeadId = null;
}

// ============ Delete Lead ============
function deleteLead() {
    if (!selectedLeadId) return;
    
    if (confirm('Are you sure you want to delete this lead?')) {
        if (usingFirebase && database) {
            database.ref('leads/' + selectedLeadId).remove()
                .then(() => {
                    closeLead();
                    alert('Lead deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting lead from Firebase:', error);
                    alert('Failed to delete lead from Firebase');
                });
        } else {
            allLeads = allLeads.filter(lead => lead.leadId !== selectedLeadId);
            localStorage.setItem('carLoanLeads', JSON.stringify(allLeads));
            closeLead();
            displayLeadsTable();
            updateDashboard();
            alert('Lead deleted successfully');
        }
    }
}

// ============ Show Statistics ============
function showStats() {
    setActiveNav('stats');
    document.getElementById('page-title').textContent = 'Statistics';
    
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('leads-section').style.display = 'none';
    document.getElementById('stats-section').style.display = 'block';
    document.getElementById('tools-section').style.display = 'none';
    
    updateStatistics();
}

// ============ Update Statistics ============
function updateStatistics() {
    // Employment Type Distribution
    const employmentCounts = {};
    allLeads.forEach(lead => {
        employmentCounts[lead.employmentType] = (employmentCounts[lead.employmentType] || 0) + 1;
    });
    
    const maxEmployment = Math.max(...Object.values(employmentCounts), 1);
    const employmentHtml = Object.entries(employmentCounts).map(([type, count]) => `
        <div class="chart-item">
            <div class="chart-label">${type}</div>
            <div class="chart-bar">
                <div class="chart-bar-fill" style="width: ${(count / maxEmployment) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    document.getElementById('employment-chart').innerHTML = employmentHtml;
    
    // Car Type Distribution
    const carTypeCounts = {};
    allLeads.forEach(lead => {
        carTypeCounts[lead.carType] = (carTypeCounts[lead.carType] || 0) + 1;
    });
    
    const maxCarType = Math.max(...Object.values(carTypeCounts), 1);
    const carTypeHtml = Object.entries(carTypeCounts).map(([type, count]) => `
        <div class="chart-item">
            <div class="chart-label">${type}</div>
            <div class="chart-bar">
                <div class="chart-bar-fill" style="width: ${(count / maxCarType) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
    
    document.getElementById('car-type-chart').innerHTML = carTypeHtml;
    
    // Average Loan Amount
    const avgLoan = allLeads.length > 0 
        ? allLeads.reduce((sum, lead) => sum + parseFloat(lead.loanAmount), 0) / allLeads.length 
        : 0;
    
    document.getElementById('loan-amount-stat').innerHTML = `<p class="large-number">₹${formatAmount(avgLoan.toFixed(0))}</p>`;
    
    // Average Car Price
    const avgCarPrice = allLeads.length > 0 
        ? allLeads.reduce((sum, lead) => sum + parseFloat(lead.carPrice), 0) / allLeads.length 
        : 0;
    
    document.getElementById('car-price-stat').innerHTML = `<p class="large-number">₹${formatAmount(avgCarPrice.toFixed(0))}</p>`;
}

// ============ Show Tools ============
function showTools() {
    setActiveNav('tools');
    document.getElementById('page-title').textContent = 'Tools';
    
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('leads-section').style.display = 'none';
    document.getElementById('stats-section').style.display = 'none';
    document.getElementById('tools-section').style.display = 'block';
}

// ============ Export Leads as CSV ============
function exportLeads() {
    if (allLeads.length === 0) {
        alert('No leads to export');
        return;
    }
    
    exportCSV();
}

// ============ Export as CSV ============
function exportCSV() {
    if (allLeads.length === 0) {
        alert('No leads to export');
        return;
    }
    
    const headers = ['Lead ID', 'Full Name', 'Mobile', 'City', 'Employment', 'Car Type', 'Car Price', 'Loan Amount', 'Bank', 'Date'];
    const rows = allLeads.map(lead => [
        lead.leadId,
        lead.fullName,
        lead.mobileNumber,
        lead.city,
        lead.employmentType,
        lead.carType,
        lead.carPrice,
        lead.loanAmount,
        lead.preferredBank,
        lead.timestamp
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    downloadFile(csv, 'car-loan-leads.csv', 'text/csv');
    alert('Leads exported successfully as CSV');
}

// ============ Export All Data ============
function exportAllData() {
    const dataStr = JSON.stringify(allLeads, null, 2);
    downloadFile(dataStr, 'car-loan-leads-backup.json', 'application/json');
    alert('Data exported successfully as JSON');
}

// ============ Download File ============
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// ============ Print Leads ============
function printLeads() {
    if (allLeads.length === 0) {
        alert('No leads to print');
        return;
    }
    
    let html = '<html><head><title>Car Loan Leads Report</title><style>';
    html += 'body { font-family: Arial, sans-serif; margin: 20px; }';
    html += 'h1 { color: #003d99; }';
    html += 'table { width: 100%; border-collapse: collapse; }';
    html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
    html += 'th { background-color: #003d99; color: white; }';
    html += 'tr:nth-child(even) { background-color: #f9f9f9; }';
    html += '</style></head><body>';
    html += '<h1>Car Loan Leads Report</h1>';
    html += '<p>Generated on: ' + new Date().toLocaleString('en-IN') + '</p>';
    html += '<p>Total Leads: ' + allLeads.length + '</p>';
    html += '<table><tr><th>Name</th><th>Mobile</th><th>City</th><th>Bank</th><th>Loan Amount</th><th>Date</th></tr>';
    
    allLeads.forEach(lead => {
        html += '<tr>';
        html += '<td>' + lead.fullName + '</td>';
        html += '<td>' + lead.mobileNumber + '</td>';
        html += '<td>' + lead.city + '</td>';
        html += '<td>' + lead.preferredBank + '</td>';
        html += '<td>₹' + formatAmount(lead.loanAmount) + '</td>';
        html += '<td>' + lead.timestamp + '</td>';
        html += '</tr>';
    });
    
    html += '</table></body></html>';
    
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// ============ Confirm Delete All ============
function confirmDeleteAll() {
    const confirmed = confirm('⚠️ WARNING: This will permanently delete ALL leads! Are you sure?');
    if (confirmed) {
        const doubleConfirm = confirm('This action cannot be undone. Are you absolutely sure?');
        if (doubleConfirm) {
            if (usingFirebase && database) {
                database.ref('leads').remove()
                    .then(() => {
                        allLeads = [];
                        localStorage.removeItem('carLoanLeads');
                        updateDashboard();
                        showDashboard();
                        alert('All leads have been deleted permanently');
                    })
                    .catch((error) => {
                        console.error('Error deleting all leads from Firebase:', error);
                        alert('Failed to delete all leads from Firebase');
                    });
            } else {
                allLeads = [];
                localStorage.removeItem('carLoanLeads');
                updateDashboard();
                showDashboard();
                alert('All leads have been deleted permanently');
            }
        }
    }
}

// ============ Check Database Status ============
function checkDatabaseStatus() {
    const storageUsed = JSON.stringify(localStorage).length;
    const storageUsedKB = (storageUsed / 1024).toFixed(2);
    
    document.getElementById('info-total-leads').textContent = allLeads.length;
    document.getElementById('info-storage').textContent = storageUsedKB + ' KB';
    document.getElementById('info-last-updated').textContent = allLeads.length > 0 ? allLeads[allLeads.length - 1].timestamp : 'No leads yet';
    document.getElementById('info-firebase-status').textContent = usingFirebase ? 'Connected' : 'Using localStorage fallback';
    
    document.getElementById('status-info').style.display = 'block';
}

// ============ Set Active Nav Link ============
function setActiveNav(section) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[onclick="show${section.charAt(0).toUpperCase() + section.slice(1)}()"]`)?.classList.add('active');
}

// ============ Logout ============
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminRemember');
        window.location.href = 'admin-login.html';
    }
}

// ============ Close Modal on Click Outside ============
window.onclick = function(event) {
    const modal = document.getElementById('lead-modal');
    if (event.target === modal) {
        closeLead();
    }
}

// ============ Auto-refresh Dashboard ============
setInterval(function() {
    if (document.getElementById('dashboard-section').style.display === 'block') {
        updateDashboard();
    }
}, 5000); // Refresh every 5 seconds
