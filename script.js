document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const scanResult = document.getElementById('scan-result');
    let html5QrcodeScanner;

    // QR Code generation with URL validation
    generateBtn.addEventListener('click', () => {
        let text = qrText.value.trim();
        
        // Add https:// if URL doesn't have a protocol
        if (text && !text.startsWith('http://') && !text.startsWith('https://') && isValidUrl(text)) {
            text = 'https://' + text;
            qrText.value = text;
        }

        if (!text) {
            alert('Please enter a URL or text');
            return;
        }

        qrCodeDiv.innerHTML = '';
        new QRCode(qrCodeDiv, { 
            text: text,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    });

    // URL validation function
    function isValidUrl(string) {
        try {
            // Try creating a URL object
            new URL(string.startsWith('http') ? string : 'https://' + string);
            return true;
        } catch (err) {
            return false;
        }
    }

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabId = btn.dataset.tab;
            tabContents.forEach(content => {
                content.style.display = content.id === tabId ? 'block' : 'none';
            });

            if (tabId === 'scan' && !html5QrcodeScanner) {
                initializeScanner();
            }
        });
    });

    // QR Code scanning
    function initializeScanner() {
        html5QrcodeScanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: {width: 250, height: 250} }
        );
        
        html5QrcodeScanner.render((decodedText, decodedResult) => {
            scanResult.innerHTML = `
                <h2>Success!</h2>
                <p>Scanned Result: ${decodedText}</p>
            `;
            html5QrcodeScanner.clear();
        }, (error) => {
            // Handle scan error
        });
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('qr-input-file');
    const html5Qrcode = new Html5Qrcode("reader");

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processQRCode(files[0]);
        }
    });

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processQRCode(files[0]);
        }
    }

    function processQRCode(file) {
        if (!file) return;
    
        html5Qrcode.scanFile(file, true)
            .then(decodedText => {
                // Create clickable link if the result is a URL
                const isUrl = decodedText.startsWith('http://') || decodedText.startsWith('https://');
                if (isUrl) {
                    scanResult.innerHTML = `
                        <h2>Success!</h2>
                        <p>Scanned Result: <a href="${decodedText}" target="_blank" class="result-link">${decodedText}</a></p>
                        <button onclick="window.open('${decodedText}', '_blank')" class="redirect-btn">Open Link</button>
                    `;
                } else {
                    scanResult.innerHTML = `
                        <h2>Success!</h2>
                        <p>Scanned Result: ${decodedText}</p>
                    `;
                }
            })
            .catch(err => {
                scanResult.innerHTML = `
                    <h2>Error!</h2>
                    <p>Could not scan QR code. Please try another image.</p>
                `;
            });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const authContainer = document.getElementById('auth-container');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    loginForm.insertBefore(successMessage, document.getElementById('login-btn').nextSibling);

    // Login functionality
    document.getElementById('login-btn').addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // Show success message
                successMessage.textContent = 'Login Successful! Redirecting...';
                successMessage.style.display = 'block';
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    authContainer.style.display = 'none';
                    mainContent.style.display = 'block';
                }, 2000);
            })
            .catch((error) => {
                successMessage.textContent = 'Error: ' + error.message;
                successMessage.style.display = 'block';
                successMessage.style.backgroundColor = '#ffebee';
                successMessage.style.color = '#c62828';
            });
    });

    // Register functionality
    document.getElementById('register-btn').addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                registerSuccess.textContent = 'Registration successful! Redirecting...';
                registerSuccess.style.display = 'block';
            })
            .catch((error) => {
                registerSuccess.textContent = 'Error: ' + error.message;
                registerSuccess.style.display = 'block';
                registerSuccess.style.backgroundColor = '#ffebee';
                registerSuccess.style.color = '#c62828';
            });
    });

    // Form toggle functionality
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // Your existing QR code functionality here...
});