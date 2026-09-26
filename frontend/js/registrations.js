window.openRegistrationModal = function(eventId) {
    const modal = document.getElementById('registrationModal');
    if (!modal) return;
    
    const user = window.getUser();
    if (user) {
        document.getElementById('regName') && (document.getElementById('regName').value = user.name || '');
        document.getElementById('regEmail') && (document.getElementById('regEmail').value = user.email || '');
        document.getElementById('regPhone') && (document.getElementById('regPhone').value = user.phone || '');
        document.getElementById('regCollegeId') && (document.getElementById('regCollegeId').value = user.college_id || '');
        document.getElementById('regDepartment') && (document.getElementById('regDepartment').value = user.department || '');
        document.getElementById('regYear') && (document.getElementById('regYear').value = user.year || '');
    }
    
    const form = document.getElementById('registrationForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            window.submitRegistration(eventId);
        };
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
};

window.submitRegistration = async function(eventId) {
    const submitBtn = document.querySelector('#registrationForm button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Confirm Registration';

    const phone = document.getElementById('regPhone')?.value.trim() || '';
    const college_id = document.getElementById('regCollegeId')?.value.trim() || '';
    const department = document.getElementById('regDepartment')?.value.trim() || '';
    const year = document.getElementById('regYear')?.value.trim() || '';
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    }

    try {
        const res = await window.authFetch('/registrations', {
            method: 'POST',
            body: JSON.stringify({ 
                event_id: eventId, 
                phone, 
                college_id, 
                department, 
                year 
            })
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            window.closeModal('registrationModal');
            
            const regData = data.data || data;
            const successModal = document.getElementById('successModal');
            if (successModal) {
                document.getElementById('successRegId') && (document.getElementById('successRegId').textContent = regData.registration_id || '');
                const qrImage = document.getElementById('qrCodeImage');
                if (qrImage && regData.qr_code) {
                    qrImage.src = regData.qr_code;
                }
                successModal.classList.add('active');
                successModal.style.display = 'flex';
            } else {
                window.showAlert('Registration successful! ID: ' + regData.registration_id, 'success');
                setTimeout(() => window.location.reload(), 2000);
            }
        } else {
            window.showAlert(data.message || 'Registration failed', 'danger');
        }
    } catch (e) {
        console.error('Registration error:', e);
        window.showAlert('Network error. Please try again.', 'danger');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
};

window.loadMyRegistrations = async function() {
    window.requireAuth();
    const tbody = document.getElementById('registrationsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    
    try {
        const res = await window.authFetch('/registrations/my');
        if (res.ok) {
            const regs = await res.json();
            if (regs.length > 0) {
                tbody.innerHTML = regs.map(r => `
                    <tr>
                        <td>${r.event_title}</td>
                        <td>${window.formatDate(r.event_date)}</td>
                        <td>${r.venue}</td>
                        <td>${r.registration_id}</td>
                        <td><span class="badge badge-${r.status === 'registered' ? 'success' : 'secondary'}">${r.status}</span></td>
                        <td>
                            <a href="/event-details.html?id=${r.event_id}" class="btn btn-sm btn-primary">View</a>
                            ${r.status === 'registered' ? `<button onclick="window.cancelRegistration('${r.id}')" class="btn btn-sm btn-danger">Cancel</button>` : ''}
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No registrations found.</td></tr>';
            }
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">Error loading registrations.</td></tr>';
    }
};

window.cancelRegistration = async function(registrationId) {
    if (!confirm('Are you sure you want to cancel this registration?')) return;
    
    try {
        const res = await window.authFetch(`/registrations/${registrationId}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            window.showAlert('Registration cancelled successfully', 'success');
            window.loadMyRegistrations();
        } else {
            const data = await res.json();
            window.showAlert(data.message || 'Failed to cancel registration', 'danger');
        }
    } catch (e) {
        window.showAlert('Network error', 'danger');
    }
};

window.loadDashboard = async function() {
    window.requireAuth();
    
    const user = window.getUser();
    if (user && document.getElementById('welcomeName')) {
        document.getElementById('welcomeName').textContent = user.name;
    }
    
    try {
        const [regRes, notifRes] = await Promise.all([
            window.authFetch('/registrations/my'),
            window.authFetch('/notifications')
        ]);
        
        if (regRes.ok) {
            const regs = await regRes.json();
            const registered = regs.filter(r => r.status === 'registered');
            const today = new Date().toISOString().split('T')[0];
            const upcoming = registered.filter(r => r.event_date > today);
            
            document.getElementById('statTotalRegistered') && (document.getElementById('statTotalRegistered').textContent = registered.length);
            document.getElementById('statUpcomingEvents') && (document.getElementById('statUpcomingEvents').textContent = upcoming.length);
            
            const upcomingList = document.getElementById('upcomingEventsList');
            if (upcomingList) {
                if (upcoming.length > 0) {
                    upcomingList.innerHTML = upcoming.map(r => `
                        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                            <h4>${r.event_title}</h4>
                            <small>${window.formatDate(r.event_date)} at ${r.venue}</small>
                            <div><a href="/event-details.html?id=${r.event_id}">View Event</a></div>
                        </div>
                    `).join('');
                } else {
                    upcomingList.innerHTML = '<p>No upcoming events.</p>';
                }
            }
        }
        
        if (notifRes.ok) {
            const notifs = await notifRes.json();
            const unreadCount = notifs.filter(n => !n.is_read).length;
            document.getElementById('statUnreadNotifs') && (document.getElementById('statUnreadNotifs').textContent = unreadCount);
            
            const notifList = document.getElementById('recentNotifsList');
            if (notifList) {
                if (notifs.length > 0) {
                    notifList.innerHTML = notifs.slice(0, 5).map(n => `
                        <div style="border-bottom: 1px solid #eee; padding: 10px 0; ${n.is_read ? 'opacity: 0.7;' : 'font-weight: bold;'}">
                            <div>${n.title}</div>
                            <small>${n.message}</small>
                        </div>
                    `).join('');
                } else {
                    notifList.innerHTML = '<p>No recent notifications.</p>';
                }
            }
        }
    } catch (e) {
        console.error('Error loading dashboard data', e);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    
    if (pathname.endsWith('my-registrations.html')) {
        window.loadMyRegistrations();
    } else if (pathname.endsWith('dashboard.html')) {
        window.loadDashboard();
    }
    
    const closeBtns = document.querySelectorAll('.close, .close-modal, .close-success, [data-dismiss="modal"]');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            e.target.style.display = 'none';
        }
    });
});
