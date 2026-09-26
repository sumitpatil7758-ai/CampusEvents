window.loadOrganizerDashboard = async function() {
    window.requireOrganizer();
    const user = window.getUser();
    
    try {
        const res = await window.authFetch('/events');
        if (res.ok) {
            const allEvents = await res.json();
            const myEvents = allEvents.filter(e => e.organizer_id === user.id);
            
            const today = new Date().toISOString().split('T')[0];
            const upcoming = myEvents.filter(e => e.event_date > today);
            const completed = myEvents.filter(e => e.event_date <= today);
            const totalParticipants = myEvents.reduce((acc, e) => acc + (e.registration_count || 0), 0);
            
            document.getElementById('statTotalEvents') && (document.getElementById('statTotalEvents').textContent = myEvents.length);
            document.getElementById('statTotalParticipants') && (document.getElementById('statTotalParticipants').textContent = totalParticipants);
            document.getElementById('statUpcomingEvents') && (document.getElementById('statUpcomingEvents').textContent = upcoming.length);
            document.getElementById('statCompletedEvents') && (document.getElementById('statCompletedEvents').textContent = completed.length);
            
            window.renderAnalytics(myEvents);
        }
    } catch (e) {
        console.error('Error loading dashboard', e);
    }
};

window.renderAnalytics = function(events) {
    const categoryCounts = {};
    let popularEvent = null;
    let maxRegs = -1;
    
    events.forEach(e => {
        const cat = e.category || 'Uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        
        if ((e.registration_count || 0) > maxRegs) {
            maxRegs = e.registration_count || 0;
            popularEvent = e;
        }
    });
    
    const chartContainer = document.getElementById('categoryChart');
    if (chartContainer) {
        const maxCount = Math.max(...Object.values(categoryCounts), 1);
        chartContainer.innerHTML = Object.keys(categoryCounts).map(cat => {
            const count = categoryCounts[cat];
            const pct = (count / maxCount) * 100;
            return `
                <div style="margin-bottom: 10px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>${cat}</span><span>${count}</span>
                    </div>
                    <div style="width:100%; background:#eee; height:10px; border-radius:5px; overflow:hidden;">
                        <div style="width:${pct}%; background:#1e90ff; height:100%;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    const popDiv = document.getElementById('popularEventStat');
    if (popDiv && popularEvent) {
        popDiv.innerHTML = `<strong>${popularEvent.title}</strong> - ${popularEvent.registration_count} participants`;
    } else if (popDiv) {
        popDiv.innerHTML = 'No data available';
    }
};

window.setupCreateEventForm = function() {
    window.requireOrganizer();
    const user = window.getUser();
    
    const orgName = document.getElementById('orgName') || document.getElementById('organizerName');
    const orgEmail = document.getElementById('orgEmail') || document.getElementById('organizerEmail');
    if (orgName && !orgName.value && user) orgName.value = user.name || '';
    if (orgEmail && !orgEmail.value && user) orgEmail.value = user.email || '';
};

window.loadManageEvents = async function() {
    window.requireOrganizer();
    const user = window.getUser();
    const tbody = document.getElementById('manageEventsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    
    try {
        const res = await window.authFetch('/events');
        if (res.ok) {
            let events = await res.json();
            events = events.filter(e => e.organizer_id === user.id);
            
            if (events.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                tbody.innerHTML = events.map(e => {
                    const status = e.event_date > today ? 'Upcoming' : 'Completed';
                    const badgeClass = status === 'Upcoming' ? 'primary' : 'secondary';
                    return `
                    <tr>
                        <td>${e.title}</td>
                        <td>${window.formatDate(e.event_date)}</td>
                        <td><span class="badge badge-info">${e.category}</span></td>
                        <td>${e.registration_count || 0}/${e.max_participants}</td>
                        <td><span class="badge badge-${badgeClass}">${status}</span></td>
                        <td>
                            <button onclick="window.editEvent('${e.id}')" class="btn btn-sm btn-secondary">Edit</button>
                            <button onclick="window.deleteEvent('${e.id}')" class="btn btn-sm btn-danger">Delete</button>
                            <a href="/participants.html?event=${e.id}" class="btn btn-sm btn-info">Participants</a>
                            <button onclick="window.openSendNotificationModal('${e.id}')" class="btn btn-sm btn-primary">Notify</button>
                        </td>
                    </tr>
                    `;
                }).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No events found. Create one!</td></tr>';
            }
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Failed to load events.</td></tr>';
    }
};

window.editEvent = async function(eventId) {
    try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
            const event = await res.json();
            
            document.getElementById('editEventId') && (document.getElementById('editEventId').value = eventId);
            document.getElementById('editTitle') && (document.getElementById('editTitle').value = event.title);
            document.getElementById('editDescription') && (document.getElementById('editDescription').value = event.description);
            // Additional fields can be mapped here as defined in edit modal HTML
            
            const modal = document.getElementById('editEventModal');
            if (modal) {
                const form = document.getElementById('editEventForm');
                if (form) {
                    form.onsubmit = async (e) => {
                        e.preventDefault();
                        const updateData = {
                            title: document.getElementById('editTitle').value,
                            description: document.getElementById('editDescription').value
                            // Map other fields...
                        };
                        
                        try {
                            const putRes = await window.authFetch(`/events/${eventId}`, {
                                method: 'PUT',
                                body: JSON.stringify(updateData)
                            });
                            
                            if (putRes.ok) {
                                window.closeModal('editEventModal');
                                window.loadManageEvents();
                                window.showAlert('Event updated', 'success');
                            } else {
                                window.showAlert('Failed to update event', 'danger');
                            }
                        } catch (err) {
                            window.showAlert('Network error', 'danger');
                        }
                    };
                }
                modal.style.display = 'block';
            }
        }
    } catch (e) {
        window.showAlert('Error loading event details', 'danger');
    }
};

window.deleteEvent = async function(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    try {
        const res = await window.authFetch(`/events/${eventId}`, { method: 'DELETE' });
        if (res.ok) {
            window.showAlert('Event deleted', 'success');
            window.loadManageEvents();
        } else {
            const data = await res.json();
            window.showAlert(data.message || 'Failed to delete event', 'danger');
        }
    } catch (e) {
        window.showAlert('Network error', 'danger');
    }
};

window.openSendNotificationModal = function(eventId) {
    const modal = document.getElementById('notificationModal');
    if (!modal) return;
    
    document.getElementById('notifEventId') && (document.getElementById('notifEventId').value = eventId);
    
    const form = document.getElementById('notificationForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const payload = {
                event_id: eventId,
                title: document.getElementById('notifTitle').value,
                message: document.getElementById('notifMessage').value
            };
            
            try {
                const res = await window.authFetch('/notifications/send', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    window.closeModal('notificationModal');
                    window.showAlert('Notification sent successfully', 'success');
                    form.reset();
                } else {
                    window.showAlert('Failed to send notification', 'danger');
                }
            } catch (err) {
                window.showAlert('Network error', 'danger');
            }
        };
    }
    
    modal.style.display = 'block';
};

window.loadOrganizerEvents = async function() {
    window.requireOrganizer();
    const user = window.getUser();
    
    try {
        const res = await window.authFetch('/events');
        if (res.ok) {
            const allEvents = await res.json();
            const myEvents = allEvents.filter(e => e.organizer_id === user.id);
            
            const selector = document.getElementById('eventSelector');
            if (selector) {
                selector.innerHTML = '<option value="">Select an event</option>' + myEvents.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
                
                const urlParams = new URLSearchParams(window.location.search);
                const eventId = urlParams.get('event');
                if (eventId) {
                    selector.value = eventId;
                    window.loadParticipants(eventId);
                }
            }
        }
    } catch (e) {
        console.error('Error loading events for selector');
    }
};

window.currentParticipants = [];

window.loadParticipants = async function(eventId) {
    if (!eventId) {
        document.getElementById('participantsTable').innerHTML = '<tr><td colspan="9" style="text-align:center;">Please select an event</td></tr>';
        return;
    }
    
    const tbody = document.getElementById('participantsTable');
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    
    try {
        const res = await window.authFetch(`/registrations/event/${eventId}`);
        if (res.ok) {
            window.currentParticipants = await res.json();
            window.renderParticipantsTable(window.currentParticipants);
        } else {
            if (tbody) tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:red;">Failed to load participants.</td></tr>';
        }
    } catch (e) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:red;">Network error.</td></tr>';
    }
};

window.renderParticipantsTable = function(participants) {
    const tbody = document.getElementById('participantsTable');
    if (!tbody) return;
    
    if (participants.length > 0) {
        tbody.innerHTML = participants.map(p => `
            <tr>
                <td>${p.user_name || '-'}</td>
                <td>${p.user_email || '-'}</td>
                <td>${p.college_id || '-'}</td>
                <td>${p.department || '-'}</td>
                <td>${p.year || '-'}</td>
                <td>${p.phone || '-'}</td>
                <td>${p.registration_id}</td>
                <td><span class="badge badge-${p.status === 'registered' ? 'success' : 'secondary'}">${p.status}</span></td>
                <td>
                    ${p.status === 'registered' ? `<button onclick="window.cancelParticipantRegistration('${p.id}')" class="btn btn-sm btn-danger">Cancel</button>` : ''}
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No participants found for this event.</td></tr>';
    }
};

window.searchParticipants = function(query) {
    if (!query) {
        window.renderParticipantsTable(window.currentParticipants);
        return;
    }
    
    const lowerQ = query.toLowerCase();
    const filtered = window.currentParticipants.filter(p => 
        (p.user_name && p.user_name.toLowerCase().includes(lowerQ)) || 
        (p.user_email && p.user_email.toLowerCase().includes(lowerQ))
    );
    window.renderParticipantsTable(filtered);
};

window.exportCSV = function(eventId) {
    if (!eventId) {
        window.showAlert('Please select an event first', 'warning');
        return;
    }
    
    const participants = window.currentParticipants || [];
    if (participants.length === 0) {
        window.showAlert('No participants to export', 'warning');
        return;
    }
    
    const headers = ['Name', 'Email', 'College ID', 'Department', 'Year', 'Phone', 'Registration ID', 'Status'];
    const rows = participants.map(p => [
        `"${p.user_name || ''}"`,
        `"${p.user_email || ''}"`,
        `"${p.college_id || ''}"`,
        `"${p.department || ''}"`,
        `"${p.year || ''}"`,
        `"${p.phone || ''}"`,
        `"${p.registration_id || ''}"`,
        `"${p.status || ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `participants_event_${eventId}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.cancelParticipantRegistration = async function(registrationId) {
    if (!confirm('Are you sure you want to cancel this participant\'s registration?')) return;
    
    try {
        const res = await window.authFetch(`/registrations/${registrationId}`, { method: 'DELETE' });
        if (res.ok) {
            window.showAlert('Registration cancelled', 'success');
            const eventId = document.getElementById('eventSelector')?.value;
            if (eventId) window.loadParticipants(eventId);
        } else {
            window.showAlert('Failed to cancel registration', 'danger');
        }
    } catch (e) {
        window.showAlert('Network error', 'danger');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    
    if (pathname.endsWith('organizer-dashboard.html')) {
        window.loadOrganizerDashboard();
    } else if (pathname.endsWith('create-event.html')) {
        window.setupCreateEventForm();
    } else if (pathname.endsWith('manage-events.html')) {
        window.loadManageEvents();
    } else if (pathname.endsWith('participants.html')) {
        window.loadOrganizerEvents();
        
        const selector = document.getElementById('eventSelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                window.loadParticipants(e.target.value);
            });
        }
        
        const searchInput = document.getElementById('participantSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                window.searchParticipants(e.target.value);
            });
        }
        
        const exportBtn = document.getElementById('exportCsvBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const eventId = document.getElementById('eventSelector')?.value;
                window.exportCSV(eventId);
            });
        }
    }
});
