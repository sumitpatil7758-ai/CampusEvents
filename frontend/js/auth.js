const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:5000/api' : '/api';

window.getToken = function() {
    return localStorage.getItem('token');
};

window.getUser = function() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

window.isLoggedIn = function() {
    return !!window.getToken();
};

window.isOrganizer = function() {
    const user = window.getUser();
    return user?.role === 'organizer';
};

window.isStudent = function() {
    const user = window.getUser();
    return user?.role === 'student';
};

window.authFetch = async function(url, options = {}) {
    const token = window.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(API_BASE + url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        window.logout();
    }
    
    return response;
};

window.showAlert = function(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.padding = '1rem';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.backgroundColor = type === 'success' ? '#d4edda' : type === 'danger' ? '#f8d7da' : '#cce5ff';
    alertDiv.style.color = type === 'success' ? '#155724' : type === 'danger' ? '#721c24' : '#004085';
    alertDiv.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : type === 'danger' ? '#f5c6cb' : '#b8daff'}`;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
};

window.formatDate = function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

window.formatTime = function(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
};

window.requireAuth = function() {
    if (!window.isLoggedIn()) {
        window.location.href = '/login.html';
    }
};

window.requireOrganizer = function() {
    window.requireAuth();
    if (!window.isOrganizer()) {
        window.location.href = '/dashboard.html';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Navbar Management
    const authOnly = document.querySelectorAll('.auth-only');
    const guestOnly = document.querySelectorAll('.guest-only');
    const studentOnly = document.querySelectorAll('.student-only');
    const organizerOnly = document.querySelectorAll('.organizer-only');
    
    if (window.isLoggedIn()) {
        authOnly.forEach(el => el.style.display = '');
        guestOnly.forEach(el => el.style.display = 'none');
        
        if (window.isStudent()) {
            studentOnly.forEach(el => el.style.display = '');
            organizerOnly.forEach(el => el.style.display = 'none');
        } else if (window.isOrganizer()) {
            organizerOnly.forEach(el => el.style.display = '');
            studentOnly.forEach(el => el.style.display = 'none');
        }
        
        // Notification Badge
        try {
            const notifBadge = document.getElementById('notifBadge');
            if (notifBadge) {
                const res = await window.authFetch('/notifications');
                if (res.ok) {
                    const result = await res.json();
                    const notifications = result.data || [];
                    const unreadCount = notifications.filter(n => !n.is_read).length;
                    if (unreadCount > 0) {
                        notifBadge.textContent = unreadCount;
                        notifBadge.style.display = '';
                    } else {
                        notifBadge.style.display = 'none';
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching notifications:', e);
        }
    } else {
        authOnly.forEach(el => el.style.display = 'none');
        guestOnly.forEach(el => el.style.display = '');
        studentOnly.forEach(el => el.style.display = 'none');
        organizerOnly.forEach(el => el.style.display = 'none');
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.logout();
        });
    }
    
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Login Page Logic
    const pathname = window.location.pathname;
    if (pathname.includes('/login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorDiv = document.getElementById('loginError');
                
                try {
                    const res = await fetch(API_BASE + '/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();
                    
                    if (res.ok) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        if (data.user.role === 'organizer') {
                            window.location.href = '/organizer-dashboard.html';
                        } else {
                            window.location.href = '/dashboard.html';
                        }
                    } else {
                        if (errorDiv) {
                            errorDiv.textContent = data.message || 'Login failed';
                            errorDiv.style.display = 'block';
                        }
                    }
                } catch (err) {
                    if (errorDiv) {
                        errorDiv.textContent = 'Network error. Please try again.';
                        errorDiv.style.display = 'block';
                    }
                }
            });
        }
    }
    
    // Register Page Logic
    if (pathname.includes('/register.html')) {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword')?.value;
                const msgDiv = document.getElementById('registerMessage') || document.getElementById('registerError');
                
                if (confirmPassword && password !== confirmPassword) {
                    if (msgDiv) {
                        msgDiv.className = 'alert alert-error';
                        msgDiv.textContent = 'Passwords do not match!';
                        msgDiv.style.display = 'block';
                    }
                    window.showAlert('Passwords do not match', 'danger');
                    return;
                }
                
                const fullNameInput = document.getElementById('fullName') || document.getElementById('name');
                const collegeIdInput = document.getElementById('collegeId') || document.getElementById('college_id');
                const emailInput = document.getElementById('email');
                const roleInput = document.getElementById('role');
                const deptInput = document.getElementById('department');
                const yearInput = document.getElementById('year');
                
                const selectedRole = (roleInput?.value || 'student').toLowerCase();
                
                const formData = {
                    name: fullNameInput ? fullNameInput.value.trim() : '',
                    email: emailInput ? emailInput.value.trim() : '',
                    password: password,
                    role: selectedRole,
                    college_id: collegeIdInput ? collegeIdInput.value.trim() : '',
                    department: deptInput ? deptInput.value : '',
                    year: yearInput ? yearInput.value : ''
                };
                
                try {
                    const res = await fetch(API_BASE + '/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok) {
                        if (msgDiv) {
                            msgDiv.className = 'alert alert-success';
                            msgDiv.textContent = 'User Registered Successfully!';
                            msgDiv.style.display = 'block';
                        }
                        window.showAlert('User Registered Successfully!', 'success');
                        registerForm.reset();
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 2000);
                    } else {
                        const errMsg = data.message || 'Registration failed';
                        if (msgDiv) {
                            msgDiv.className = 'alert alert-error';
                            msgDiv.textContent = errMsg;
                            msgDiv.style.display = 'block';
                        }
                        window.showAlert(errMsg, 'danger');
                    }
                } catch (err) {
                    console.error('Registration error:', err);
                    if (msgDiv) {
                        msgDiv.className = 'alert alert-error';
                        msgDiv.textContent = 'Network error. Please try again.';
                        msgDiv.style.display = 'block';
                    }
                    window.showAlert('Network error. Please try again.', 'danger');
                }
            });
        }
    }

    // Automatically initialize 3D tilt & micro-interactions on all pages
    if (!window.init3DTilt) {
        const tiltScript = document.createElement('script');
        tiltScript.src = 'js/interactions.js';
        tiltScript.async = true;
        document.body.appendChild(tiltScript);
    }
});

