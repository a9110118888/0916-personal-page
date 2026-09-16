// Japanese Retro Personal Page Interactive Engine

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const clockHours = document.getElementById('clock-hours');
    const clockMinutes = document.getElementById('clock-minutes');
    const clockSeconds = document.getElementById('clock-seconds');
    const clockAmpm = document.getElementById('clock-ampm');
    const clockFormatBtn = document.getElementById('clock-format-btn');
    const formatLabel = document.getElementById('format-label');
    const dateText = document.getElementById('date-text');
    const timezoneText = document.getElementById('timezone-text');

    const crtOverlay = document.getElementById('crt-overlay');
    const crtToggleBtn = document.getElementById('crt-toggle-btn');
    const crtLabel = document.getElementById('crt-label');

    const greetingText = document.getElementById('greeting-text');
    const userNameDisplay = document.getElementById('user-name-display');
    const editNameBtn = document.getElementById('edit-name-btn');
    const nameInputContainer = document.getElementById('name-input-container');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name-btn');
    const cancelNameBtn = document.getElementById('cancel-name-btn');

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeLabel = document.getElementById('theme-label');

    const goalDisplay = document.getElementById('goal-display');
    const editGoalBtn = document.getElementById('edit-goal-btn');
    const goalInputContainer = document.getElementById('goal-input-container');
    const goalInput = document.getElementById('goal-input');
    const saveGoalBtn = document.getElementById('save-goal-btn');

    const dayProgressBar = document.getElementById('day-progress-bar');
    const dayProgressPercent = document.getElementById('day-progress-percent');
    const timeRemainingText = document.getElementById('time-remaining-text');
    const footerYear = document.getElementById('footer-year');

    // State Variables
    let is24HourFormat = true;
    let isCrtEnabled = true;
    const themes = [
        { id: 'showa-paper', label: '和紙' },
        { id: 'city-pop', label: 'CityPop' },
        { id: 'showa-dark', label: '昭和夜' }
    ];
    let currentThemeIndex = 0;

    // --- 1. User Preferences Initialization ---
    function initUserPreferences() {
        const savedName = localStorage.getItem('personal_user_name');
        if (savedName) {
            userNameDisplay.textContent = savedName;
        }

        const savedGoal = localStorage.getItem('personal_user_goal');
        if (savedGoal) {
            goalDisplay.textContent = savedGoal;
        }

        const savedFormat = localStorage.getItem('personal_clock_format');
        if (savedFormat !== null) {
            is24HourFormat = savedFormat === '24';
            formatLabel.textContent = is24HourFormat ? '24H' : '12H';
        }

        const savedTheme = localStorage.getItem('personal_retro_theme');
        if (savedTheme) {
            const foundIndex = themes.findIndex(t => t.id === savedTheme);
            if (foundIndex !== -1) {
                currentThemeIndex = foundIndex;
                setTheme(themes[currentThemeIndex]);
            }
        }
    }

    // --- 2. Live Clock & Japanese Date Engine ---
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Japanese Greeting based on hour
        updateJapaneseGreeting(hours);

        // Formatting AM/PM & 12h
        if (!is24HourFormat) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            clockAmpm.textContent = ampm;
            clockAmpm.classList.remove('hidden');
            hours = hours % 12 || 12;
        } else {
            clockAmpm.classList.add('hidden');
        }

        clockHours.textContent = String(hours).padStart(2, '0');
        clockMinutes.textContent = String(minutes).padStart(2, '0');
        clockSeconds.textContent = String(seconds).padStart(2, '0');

        // Japanese Date Format: 2026年 9月 16日 (水)
        const daysJP = ['日', '月', '火', '水', '木', '金', '土'];
        const dayKanji = daysJP[now.getDay()];
        dateText.textContent = `${now.getFullYear()}年 ${now.getMonth() + 1}月 ${now.getDate()}日 (${dayKanji})`;

        // Day Progress Calculation
        updateDayProgress(now);
    }

    function updateJapaneseGreeting(hours) {
        let greeting = 'こんにちは';
        if (hours >= 5 && hours < 11) {
            greeting = 'おはようございます';
        } else if (hours >= 11 && hours < 17) {
            greeting = 'こんにちは';
        } else if (hours >= 17 && hours < 22) {
            greeting = 'こんばんは';
        } else {
            greeting = 'おやすみなさい';
        }
        greetingText.textContent = greeting;
    }

    function updateDayProgress(now) {
        const totalSecondsInDay = 24 * 60 * 60;
        const currentSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        const percent = ((currentSeconds / totalSecondsInDay) * 100).toFixed(1);

        dayProgressBar.style.width = `${percent}%`;
        dayProgressPercent.textContent = `${percent}% 経過`;

        const remainingSeconds = totalSecondsInDay - currentSeconds;
        const remainingHours = Math.floor(remainingSeconds / 3600);
        const remainingMins = Math.floor((remainingSeconds % 3600) / 60);
        timeRemainingText.textContent = `残り ${remainingHours}時間${remainingMins}分`;
    }

    function initTimezone() {
        try {
            const offsetMinutes = new Date().getTimezoneOffset();
            const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
            const sign = offsetMinutes <= 0 ? '+' : '-';
            const padHours = String(offsetHours).padStart(2, '0');
            timezoneText.textContent = `東京・台北標準時 (UTC${sign}${padHours}:00)`;
        } catch (e) {
            timezoneText.textContent = '東京・台北標準時 (UTC+08:00)';
        }
        footerYear.textContent = new Date().getFullYear();
    }

    // --- 3. Name & Goal Editors ---
    function openNameEditor() {
        nameInput.value = userNameDisplay.textContent;
        userNameDisplay.classList.add('hidden');
        editNameBtn.classList.add('hidden');
        nameInputContainer.classList.remove('hidden');
        nameInput.focus();
    }

    function closeNameEditor(save = false) {
        if (save && nameInput.value.trim() !== '') {
            const newName = nameInput.value.trim();
            userNameDisplay.textContent = newName;
            localStorage.setItem('personal_user_name', newName);
        }
        nameInputContainer.classList.add('hidden');
        userNameDisplay.classList.remove('hidden');
        editNameBtn.classList.remove('hidden');
    }

    function openGoalEditor() {
        goalInput.value = goalDisplay.textContent;
        goalDisplay.classList.add('hidden');
        editGoalBtn.classList.add('hidden');
        goalInputContainer.classList.remove('hidden');
        goalInput.focus();
    }

    function closeGoalEditor(save = false) {
        if (save && goalInput.value.trim() !== '') {
            const newGoal = goalInput.value.trim();
            goalDisplay.textContent = newGoal;
            localStorage.setItem('personal_user_goal', newGoal);
        }
        goalInputContainer.classList.add('hidden');
        goalDisplay.classList.remove('hidden');
        editGoalBtn.classList.remove('hidden');
    }

    // --- 4. CRT & Theme Switchers ---
    function toggleCRT() {
        isCrtEnabled = !isCrtEnabled;
        if (isCrtEnabled) {
            crtOverlay.classList.remove('disabled');
            crtLabel.textContent = 'CRT ON';
        } else {
            crtOverlay.classList.add('disabled');
            crtLabel.textContent = 'CRT OFF';
        }
    }

    function setTheme(themeObj) {
        document.documentElement.setAttribute('data-theme', themeObj.id);
        themeLabel.textContent = themeObj.label;
        localStorage.setItem('personal_retro_theme', themeObj.id);
    }

    function toggleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        setTheme(themes[currentThemeIndex]);
    }

    // --- Event Listeners ---
    crtToggleBtn.addEventListener('click', toggleCRT);
    clockFormatBtn.addEventListener('click', () => {
        is24HourFormat = !is24HourFormat;
        formatLabel.textContent = is24HourFormat ? '24H' : '12H';
        localStorage.setItem('personal_clock_format', is24HourFormat ? '24' : '12');
        updateClock();
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    userNameDisplay.addEventListener('click', openNameEditor);
    editNameBtn.addEventListener('click', openNameEditor);
    saveNameBtn.addEventListener('click', () => closeNameEditor(true));
    cancelNameBtn.addEventListener('click', () => closeNameEditor(false));
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeNameEditor(true);
        if (e.key === 'Escape') closeNameEditor(false);
    });

    editGoalBtn.addEventListener('click', openGoalEditor);
    saveGoalBtn.addEventListener('click', () => closeGoalEditor(true));
    goalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeGoalEditor(true);
        if (e.key === 'Escape') closeGoalEditor(false);
    });

    // --- Initialize ---
    initUserPreferences();
    initTimezone();
    updateClock();
    setInterval(updateClock, 1000);
});
