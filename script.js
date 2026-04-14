const clockElement = document.getElementById('clock');
const currentDateElement = document.getElementById('current-date');
const monthYearElement = document.getElementById('month-year');
const calendarDaysElement = document.getElementById('calendar-days');

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

let currentRenderedMonth = -1;

function updateTime() {
    const now = new Date();

    // Format time (HH:MM:SS)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    // Format full date string (e.g., Monday, January 1)
    const dayName = daysOfWeek[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    currentDateElement.textContent = `${dayName}, ${monthName} ${date}`;

    // Update calendar if the month has changed
    if (currentRenderedMonth !== now.getMonth()) {
        renderCalendar(now);
        currentRenderedMonth = now.getMonth();
    } else {
        // Just update "today" highlight if day changes without month changing
        updateTodayHighlight(now);
    }
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);
    const currentDay = today.getDate();

    // Set header
    monthYearElement.textContent = `${months[month]} ${year}`;

    // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();

    // Get number of days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Clear previous calendar
    calendarDaysElement.innerHTML = '';

    // Calculate total slots needed (previous month overflow + current month + next month overflow)
    // Always show 6 rows (42 slots) to keep calendar height consistent
    const totalSlots = 42;

    // Render previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        dayDiv.textContent = daysInPrevMonth - i;
        calendarDaysElement.appendChild(dayDiv);
    }

    // Render current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;

        if (isCurrentMonth && i === currentDay) {
            dayDiv.classList.add('today');
            dayDiv.id = 'today-cell';
        }

        calendarDaysElement.appendChild(dayDiv);
    }

    // Render next month days
    const remainingSlots = totalSlots - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingSlots; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        dayDiv.textContent = i;
        calendarDaysElement.appendChild(dayDiv);
    }
}

function updateTodayHighlight(now) {
    // Only matters if we are rendering the current month and year
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    // Find the current rendered month/year text to verify
    const headerText = monthYearElement.textContent;
    const expectedHeader = `${months[month]} ${year}`;

    if (headerText === expectedHeader) {
        // Remove old today highlight
        const oldToday = document.getElementById('today-cell');
        if (oldToday) {
            // Check if the old today cell is actually yesterday
            if (parseInt(oldToday.textContent) !== date) {
                oldToday.classList.remove('today');
                oldToday.removeAttribute('id');

                // Find and highlight new today
                const days = calendarDaysElement.querySelectorAll('.day:not(.other-month)');
                days.forEach(day => {
                    if (parseInt(day.textContent) === date) {
                        day.classList.add('today');
                        day.id = 'today-cell';
                    }
                });
            }
        }
    }
}

// Background rotation logic (every hour to keep it fresh)
function rotateBackground() {
    const bg = document.querySelector('.background-wrapper');
    // Add a timestamp to bypass cache
    bg.style.backgroundImage = `url('https://picsum.photos/1920/1080?random=${new Date().getTime()}')`;
}

// Initialize
function init() {
    updateTime();

    // Update clock every second
    setInterval(updateTime, 1000);

    // Change background every 1 hour (3600000 ms)
    setInterval(rotateBackground, 3600000);
}

// Start app
init();