window.createEventCard = function(event) {
    const banner = event.banner_url ? `<img src="${event.banner_url}" alt="${event.title}" style="width:100%;height:200px;object-fit:cover;">` : `<div class="event-card-image-placeholder" style="background: linear-gradient(135deg, #6C63FF, #5A52D5); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: 700; height: 200px;">${event.title}</div>`;
    
    const percentage = event.max_participants > 0 ? (event.registration_count / event.max_participants) * 100 : 0;
    
    return `
<div class="event-card">
  <div class="event-card-image" style="position: relative;">
    ${banner}
    <span class="badge badge-${(event.category || '').toLowerCase()}" style="position: absolute; top: 1rem; right: 1rem;">${event.category || 'Event'}</span>
  </div>
  <div class="event-card-body">
    <h3 class="event-card-title">${event.title}</h3>
    <div class="event-card-info">
      <span><i class="fas fa-calendar"></i> ${window.formatDate(event.event_date)}</span>
      <span><i class="fas fa-clock"></i> ${window.formatTime(event.start_time)} - ${window.formatTime(event.end_time)}</span>
      <span><i class="fas fa-map-marker-alt"></i> ${event.venue}</span>
    </div>
    <div class="event-card-footer">
      <div class="seat-info">
        <div class="seat-bar"><div class="seat-bar-fill" style="width: ${percentage}%"></div></div>
        <small>${event.registration_count || 0}/${event.max_participants} seats filled</small>
      </div>
      <a href="/event-details.html?id=${event.id}" class="btn btn-primary btn-sm">View Details</a>
    </div>
  </div>
</div>
    `;
};

window.loadStats = async function() {
    try {
        const res = await fetch('/api/events/stats/overview');
        if (res.ok) {
            const data = await res.json();
            const animateValue = (id, end) => {
                const obj = document.getElementById(id);
                if (!obj) return;
                let start = 0;
                const duration = 1000;
                const stepTime = Math.abs(Math.floor(duration / (end || 1)));
                const timer = setInterval(() => {
                    start += 1;
                    obj.textContent = start;
                    if (start >= end) {
                        obj.textContent = end;
                        clearInterval(timer);
                    }
                }, stepTime);
                if(end === 0) obj.textContent = 0;
            };
            
            animateValue('statTotalEvents', data.total_events);
            animateValue('statActiveEvents', data.active_events);
            animateValue('statRegisteredStudents', data.registered_students);
            animateValue('statOrganizers', data.organizers);
        }
    } catch (e) {
        console.error('Failed to load stats', e);
    }
};

window.loadFeaturedEvents = async function() {
    try {
        const res = await fetch('/api/events?sort=upcoming');
        if (res.ok) {
            const events = await res.json();
            const container = document.getElementById('featuredEvents');
            if (container) {
                container.innerHTML = events.slice(0, 6).map(e => window.createEventCard(e)).join('');
            }
        }
    } catch (e) {
        console.error('Failed to load featured events', e);
    }
};

window.loadAllEvents = async function() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    
    const search = searchInput ? searchInput.value : '';
    const category = categorySelect ? categorySelect.value : '';
    const sort = sortSelect ? sortSelect.value : '';
    
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid) eventsGrid.innerHTML = '<div style="text-align:center; width:100%;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
    
    try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category) query.append('category', category);
        if (sort) query.append('sort', sort);
        
        const res = await fetch(`/api/events?${query.toString()}`);
        if (res.ok) {
            const events = await res.json();
            if (eventsGrid) {
                if (events.length > 0) {
                    eventsGrid.innerHTML = events.map(e => window.createEventCard(e)).join('');
                } else {
                    eventsGrid.innerHTML = '<div style="text-align:center; width:100%; padding:20px;">No events found matching your criteria.</div>';
                }
            }
        }
    } catch (e) {
        console.error('Failed to load events', e);
        if (eventsGrid) eventsGrid.innerHTML = '<div style="text-align:center; width:100%; color:red;">Error loading events.</div>';
    }
};

window.loadEventDetails = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        window.showAlert('Event not found', 'danger');
        return;
    }
    
    try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error('Event not found');
        const event = await res.json();
        
        document.getElementById('eventTitle') && (document.getElementById('eventTitle').textContent = event.title);
        document.getElementById('eventDescription') && (document.getElementById('eventDescription').textContent = event.description);
        document.getElementById('eventDate') && (document.getElementById('eventDate').textContent = window.formatDate(event.event_date));
        document.getElementById('eventTime') && (document.getElementById('eventTime').textContent = `${window.formatTime(event.start_time)} - ${window.formatTime(event.end_time)}`);
        document.getElementById('eventVenue') && (document.getElementById('eventVenue').textContent = event.venue);
        document.getElementById('eventCategory') && (document.getElementById('eventCategory').textContent = event.category);
        document.getElementById('eventOrganizer') && (document.getElementById('eventOrganizer').textContent = event.organizer_name || 'Organizer');
        
        const banner = document.getElementById('eventBanner');
        if (banner) {
            if (event.banner_url) {
                banner.src = event.banner_url;
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        }
        
        const seatsProgress = document.getElementById('seatsProgress');
        const seatsText = document.getElementById('seatsText');
        const percentage = event.max_participants > 0 ? (event.registration_count / event.max_participants) * 100 : 0;
        
        if (seatsProgress) seatsProgress.style.width = `${percentage}%`;
        if (seatsText) seatsText.textContent = `${event.registration_count || 0}/${event.max_participants} seats filled`;
        
        const actionContainer = document.getElementById('eventActionContainer');
        if (actionContainer) {
            if (!window.isLoggedIn()) {
                actionContainer.innerHTML = '<a href="/login.html" class="btn btn-primary">Login to Register</a>';
            } else if (window.isStudent()) {
                const regRes = await window.authFetch(`/registrations/check/${eventId}`);
                if (regRes.ok) {
                    const regData = await regRes.json();
                    if (regData.registered) {
                        actionContainer.innerHTML = '<span class="badge badge-success" style="font-size:1.1rem; padding:10px;">Already Registered</span>';
                    } else {
                        const today = new Date().toISOString().split('T')[0];
                        if (event.registration_deadline && today > event.registration_deadline) {
                            actionContainer.innerHTML = '<span class="badge badge-danger" style="font-size:1.1rem; padding:10px;">Registration Closed</span>';
                        } else if (event.registration_count >= event.max_participants) {
                            actionContainer.innerHTML = '<span class="badge badge-danger" style="font-size:1.1rem; padding:10px;">Registration Full</span>';
                        } else {
                            actionContainer.innerHTML = `<button onclick="window.openRegistrationModal('${eventId}')" class="btn btn-primary">Register Now</button>`;
                        }
                    }
                }
            }
        }
        
    } catch (e) {
        console.error(e);
        window.showAlert('Failed to load event details', 'danger');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    
    if (pathname === '/' || pathname.endsWith('index.html')) {
        window.loadStats();
        window.loadFeaturedEvents();
    } else if (pathname.endsWith('events.html')) {
        window.loadAllEvents();
        
        let debounceTimer;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(window.loadAllEvents, 300);
            });
        }
        
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) categorySelect.addEventListener('change', window.loadAllEvents);
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.addEventListener('change', window.loadAllEvents);
        
    } else if (pathname.endsWith('event-details.html')) {
        window.loadEventDetails();
    }
});
