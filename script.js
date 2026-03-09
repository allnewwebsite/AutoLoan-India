// ============ Firebase Configuration ============
// Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_bthyCY_P3dVMudQKEDxroGh3VO-M68A",
    authDomain: "autoloan-india.firebaseapp.com",
    databaseURL: "https://autoloan-india-default-rtdb.firebaseio.com",
    projectId: "autoloan-india",
    storageBucket: "autoloan-india.firebasestorage.app",
    messagingSenderId: "700809496368",
    appId: "1:700809496368:web:cf5a007b4d4d2bab5b2af5"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.log('Firebase initialization skipped - Demo mode enabled');
    console.log('To enable Firebase, configure your credentials in script.js');
}

// ============ EMI Calculator ============
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const tenure = parseInt(document.getElementById('tenure').value);

    // Validate inputs
    if (!loanAmount || !interestRate || !tenure) {
        alert('Please enter all values');
        return;
    }

    if (loanAmount <= 0 || interestRate < 0 || tenure <= 0) {
        alert('Please enter valid values');
        return;
    }

    // EMI Formula: [P * R * (1+R)^N] / [(1+R)^N - 1]
    const monthlyRate = interestRate / 100 / 12;
    const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure);
    const denominator = Math.pow(1 + monthlyRate, tenure) - 1;
    const emi = numerator / denominator;

    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;

    // Display results
    document.getElementById('emiResult').textContent = '₹ ' + formatAmount(emi.toFixed(0));
    document.getElementById('interestResult').textContent = '₹ ' + formatAmount(totalInterest.toFixed(0));
    document.getElementById('totalResult').textContent = '₹ ' + formatAmount(totalPayment.toFixed(0));

    // Log to console
    console.log('EMI Calculation:');
    console.log('Loan Amount: ₹' + formatAmount(loanAmount));
    console.log('Interest Rate: ' + interestRate + '% p.a.');
    console.log('Tenure: ' + tenure + ' months');
    console.log('Monthly EMI: ₹' + formatAmount(emi.toFixed(0)));
    console.log('Total Interest: ₹' + formatAmount(totalInterest.toFixed(0)));
    console.log('Total Payment: ₹' + formatAmount(totalPayment.toFixed(0)));
}

// ============ Format Amount ============
function formatAmount(amount) {
    return parseFloat(amount).toLocaleString('en-IN');
}

// ============ Bank Selection ============
function selectBank(bankName) {
    document.getElementById('preferredBank').value = bankName;
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

// ============ Scroll to Apply ============
function scrollToApply() {
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

// ============ Hero Header Slider ============
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) {
        return;
    }

    let currentIndex = 0;
    setInterval(function() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, 4000);
}

// ============ Form Submission ============
document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        city: document.getElementById('city').value.trim(),
        employmentType: document.getElementById('employmentType').value,
        carType: document.getElementById('carType').value,
        carPrice: document.getElementById('carPrice').value,
        loanAmount: document.getElementById('loanAmountForm').value,
        preferredBank: document.getElementById('preferredBank').value,
        timestamp: new Date().toLocaleString('en-IN'),
        leadId: generateLeadId()
    };

    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }

    // Log to console (Demo mode)
    console.log('=== CAR LOAN APPLICATION SUBMITTED ===');
    console.log(formData);
    console.log('=====================================');

    // Save to Firebase (if available)
    if (database) {
        saveToFirebase(formData);
    } else {
        console.log('Firebase not configured. Saved to localStorage instead.');
        saveToLocalStorage(formData);
    }

    // Show success message
    showSuccessMessage();

    // Send WhatsApp notification (optional)
    sendWhatsAppNotification(formData);
});

// ============ Validate Form Data ============
function validateFormData(data) {
    // Validate full name
    if (!data.fullName || data.fullName.length < 3) {
        alert('Please enter a valid full name');
        return false;
    }

    // Validate mobile number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.mobileNumber.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit mobile number');
        return false;
    }

    // Validate city
    if (!data.city || data.city.length < 2) {
        alert('Please enter a valid city');
        return false;
    }

    // Validate employment type
    if (!data.employmentType) {
        alert('Please select employment type');
        return false;
    }

    // Validate car type
    if (!data.carType) {
        alert('Please select car type');
        return false;
    }

    // Validate car price
    if (!data.carPrice || parseFloat(data.carPrice) <= 0) {
        alert('Please enter a valid car price');
        return false;
    }

    // Validate loan amount
    if (!data.loanAmount || parseFloat(data.loanAmount) <= 0) {
        alert('Please enter a valid loan amount');
        return false;
    }

    // Validate loan amount not more than car price
    if (parseFloat(data.loanAmount) > parseFloat(data.carPrice)) {
        alert('Loan amount cannot be more than car price');
        return false;
    }

    // Validate bank selection
    if (!data.preferredBank) {
        alert('Please select a preferred bank');
        return false;
    }

    return true;
}

// ============ Generate Lead ID ============
function generateLeadId() {
    return 'LEAD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ============ Save to Firebase ============
function saveToFirebase(formData) {
    try {
        const leadsRef = database.ref('leads/' + formData.leadId);
        leadsRef.set(formData, function(error) {
            if (error) {
                console.log('Firebase save error:', error);
                console.log('Saving to localStorage instead');
                saveToLocalStorage(formData);
            } else {
                console.log('Lead saved to Firebase successfully!');
            }
        });
    } catch (error) {
        console.log('Firebase operation error:', error);
        saveToLocalStorage(formData);
    }
}

// ============ Save to Local Storage ============
function saveToLocalStorage(formData) {
    try {
        let leads = JSON.parse(localStorage.getItem('carLoanLeads')) || [];
        leads.push(formData);
        localStorage.setItem('carLoanLeads', JSON.stringify(leads));
        console.log('Lead saved to localStorage. Total leads:', leads.length);
    } catch (error) {
        console.log('localStorage error:', error);
    }
}

// ============ Show Success Message ============
function showSuccessMessage() {
    const form = document.getElementById('loanForm');
    const successMessage = document.getElementById('successMessage');

    form.style.display = 'none';
    successMessage.style.display = 'block';

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

// ============ Reset Form ============
function resetForm() {
    document.getElementById('loanForm').reset();
    document.getElementById('loanForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ Send WhatsApp Notification ============
function sendWhatsAppNotification(formData) {
    const message = `New Car Loan Lead:\n
Name: ${formData.fullName}
Mobile: ${formData.mobileNumber}
City: ${formData.city}
Car Type: ${formData.carType}
Car Price: ₹${formatAmount(formData.carPrice)}
Loan Amount: ₹${formatAmount(formData.loanAmount)}
Bank: ${formData.preferredBank}
Employment: ${formData.employmentType}
Lead ID: ${formData.leadId}`;

    // Log the message (WhatsApp would require backend API for automated sending)
    console.log('WhatsApp Notification Message:');
    console.log(message);
}

// ============ Calculate EMI on page load ============
window.addEventListener('load', function() {
    calculateEMI(); // Show default EMI calculation
    initHeroSlider();
});

// ============ Real-time EMI Calculation ============
document.getElementById('loanAmount').addEventListener('input', calculateEMI);
document.getElementById('interestRate').addEventListener('input', calculateEMI);
document.getElementById('tenure').addEventListener('input', calculateEMI);

// ============ Mobile Menu Toggle ============
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        
        // Animate hamburger
        const spans = document.querySelectorAll('.hamburger span');
        spans.forEach((span, index) => {
            if (navLinks.style.display === 'flex') {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(10px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });
}

// ============ Close mobile menu on link click ============
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (navLinks) {
            navLinks.style.display = 'none';
            document.querySelectorAll('.hamburger span').forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
});

// ============ Retrieve and Display Leads (for admin) ============
function displayAllLeads() {
    try {
        const leads = JSON.parse(localStorage.getItem('carLoanLeads')) || [];
        console.log('=== ALL CAR LOAN LEADS ===');
        console.table(leads);
        return leads;
    } catch (error) {
        console.log('Error retrieving leads:', error);
        return [];
    }
}

// ============ Clear All Leads (admin function) ============
function clearAllLeads() {
    if (confirm('Are you sure you want to clear all leads? This action cannot be undone.')) {
        try {
            localStorage.removeItem('carLoanLeads');
            console.log('All leads cleared successfully');
        } catch (error) {
            console.log('Error clearing leads:', error);
        }
    }
}

// ============ Export Leads as JSON ============
function exportLeadsAsJSON() {
    try {
        const leads = JSON.parse(localStorage.getItem('carLoanLeads')) || [];
        if (leads.length === 0) {
            alert('No leads to export');
            return;
        }

        const dataStr = JSON.stringify(leads, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'car-loan-leads-' + new Date().getTime() + '.json';
        link.click();
        URL.revokeObjectURL(url);

        console.log('Leads exported successfully');
    } catch (error) {
        console.log('Error exporting leads:', error);
    }
}

// ============ Smooth Scroll for Navigation ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ Add to Browser Console ============
console.log('%cWelcome to AutoLoan India!', 'color: #003d99; font-size: 20px; font-weight: bold;');
console.log('%cUseful Commands:', 'color: #0056cc; font-size: 14px; font-weight: bold;');
console.log('displayAllLeads() - View all submitted leads');
console.log('clearAllLeads() - Clear all leads (caution!)');
console.log('exportLeadsAsJSON() - Export leads as JSON file');
console.log('%cNote: Firebase integration requires proper configuration', 'color: #f56565; font-size: 12px;');
