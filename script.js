const timeSlots = {
    "bachata": ["10:00", "13:00", "16:00"],
    "salsa": ["10:00", "13:00", "19:00"],
    "meringue": ["10:00", "13:00"],
    "kompa": ["16:00", "19:00"],
    "private": ["10:00", "13:00", "16:00"],
    "social-nights": ["20:00"] 
};

const instructorSlots = {
    "alejandro": ["10:00", "13:00"],
    "sofia": ["10:00", "13:00"],
    "jean-pierre": ["10:00", "13:00"]
};

function toggleInstructor() {
    const activity = document.getElementById('activity').value;
    const instructorGroup = document.getElementById('instructor-group');
    if (activity === 'private') {
        instructorGroup.style.display = 'block';
    } else {
        instructorGroup.style.display = 'none';
        document.getElementById('instructor').value = '';
    }
}

function getNextNDays(daysOfWeek, n = 5) {
    const dates = [];
    let currentDate = new Date();

    while (dates.length < n * daysOfWeek.length) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (daysOfWeek.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate));
        }
    }

    return dates;
}

function updateTimeSlots() {
    const activity = document.getElementById('activity').value;
    const instructor = document.getElementById('instructor').value;
    const dateTimeSelect = document.getElementById('date-time');
    const availableSlots = timeSlots[activity] || [];
    let slots = [];

    let daysOfWeek = [];
    if (["bachata", "salsa"].includes(activity)) {
        daysOfWeek = [1, 3, 5]; // Monday, Wednesday, Friday
    } else if (["meringue", "kompa"].includes(activity)) {
        daysOfWeek = [2, 4]; // Tuesday, Thursday
    } else if (activity === 'private' && instructor) {
        daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
    } else if (activity === 'social-nights') {
        daysOfWeek = [6]; // Saturday
    }

    let dates = getNextNDays(daysOfWeek, 5);

    dates.forEach(date => {
        availableSlots.forEach(time => {
            let [hours, minutes] = time.split(':');
            let slotDate = new Date(date);
            slotDate.setHours(hours);
            slotDate.setMinutes(minutes);
            slots.push(slotDate);
        });
    });

    if (activity === 'private' && instructor) {
        slots = [];
        dates.forEach(date => {
            (instructorSlots[instructor] || []).forEach(time => {
                let [hours, minutes] = time.split(':');
                let slotDate = new Date(date);
                slotDate.setHours(hours);
                slotDate.setMinutes(minutes);
                slots.push(slotDate);
            });
        });
    }
    
    dateTimeSelect.innerHTML = slots.map(slot => {
        const dateString = slot.toLocaleDateString();
        const timeString = slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `<option value="${slot.toISOString()}">${dateString} ${timeString}</option>`;
    }).join('');    
}

function toggleOnline() {
    const isOnline = document.getElementById('online-class').checked;
    const address = document.getElementById('confirm-address');
    const onlineNote = document.getElementById('online-note');
    if (isOnline) {
        address.style.display = 'none';
        onlineNote.style.display = 'block';
    } else {
        address.style.display = 'block';
        onlineNote.style.display = 'none';
    }
}

function showConfirmation(event) {
    event.preventDefault();
    const activity = document.getElementById('activity').value;
    const dateTime = document.getElementById('date-time').value;
    const instructor = document.getElementById('instructor').value;
    const isOnline = document.getElementById('online-class').checked;

    document.getElementById('confirm-class').textContent = activity.charAt(0).toUpperCase() + activity.slice(1);
    document.getElementById('confirm-date').textContent = new Date(dateTime).toLocaleDateString();
    document.getElementById('confirm-time').textContent = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('confirm-instructor').textContent = instructor ? document.querySelector(`#instructor option[value="${instructor}"]`).textContent : 'N/A';

    if (isOnline) {
        document.getElementById('confirm-address').style.display = 'none';
        document.getElementById('online-note').style.display = 'block';
    } else {
        document.getElementById('confirm-address').style.display = 'block';
        document.getElementById('online-note').style.display = 'none';
    }

    document.getElementById('confirmation-modal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    toggleInstructor();
    updateTimeSlots();
});


function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    location.reload(); 
}

document.addEventListener('DOMContentLoaded', function() {
    toggleInstructor();
    updateTimeSlots();
});
