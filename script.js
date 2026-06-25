/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  // === DOM ELEMENTS ===
  // Clocks
  const clockDigital = document.getElementById('clock-digital');
  const clockAnalog = document.getElementById('clock-analog');
  const clockFlip = document.getElementById('clock-flip');
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  const greetingEl = document.getElementById('greeting');
  const hourHand = document.querySelector('.hour-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const secondHand = document.querySelector('.second-hand');
  const flipHour = document.getElementById('flip-hour');
  const flipMinute = document.getElementById('flip-minute');

  // Backgrounds & Glass
  const bgLayer = document.getElementById('bg-layer');
  const customBgLayer = document.getElementById('custom-bg-layer');
  const weatherBgLayer = document.getElementById('weather-bg-layer');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const opacitySlider = document.getElementById('glass-opacity');
  const blurSlider = document.getElementById('glass-blur');

  // Search & AI
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const aiSelector = document.getElementById('ai-selector');
  const currentAiIcon = document.getElementById('current-ai-icon');
  const aiOptions = document.querySelectorAll('.ai-option');

  // Sidebars & Modals
  const settingsSidebar = document.getElementById('settings-sidebar');
  const todoSidebar = document.getElementById('todo-sidebar');
  const devToolsSidebar = document.getElementById('dev-tools-sidebar');
  const aiHistorySidebar = document.getElementById('ai-history-sidebar');
  const browserHistorySidebar = document.getElementById('browser-history-sidebar');
  const notesSidebar = document.getElementById('notes-sidebar');
  
  const settingsBtn = document.getElementById('settings-btn');
  const todoBtn = document.getElementById('todo-btn');
  const devToolsBtn = document.getElementById('dev-tools-btn');
  const aiHistoryBtn = document.getElementById('ai-history-btn');
  const browserHistoryBtn = document.getElementById('browser-history-btn');
  const notesBtn = document.getElementById('notes-btn');
  const aboutBtn = document.getElementById('about-btn');

  // Modals
  const shortcutModal = document.getElementById('shortcut-modal');
  const aboutModal = document.getElementById('about-modal');

  // Weather
  const weatherWidget = document.getElementById('weather-widget');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherTemp = document.getElementById('weather-temp');

  // === 1. SETTINGS & THEMING ===
  // Clock Style
  const clockStyleSelect = document.getElementById('clock-style-select');
  let currentClockStyle = localStorage.getItem('clock-style') || 'digital';
  clockStyleSelect.value = currentClockStyle;

  function updateClockDisplay() {
    clockDigital.style.display = currentClockStyle === 'digital' ? 'block' : 'none';
    clockAnalog.style.display = currentClockStyle === 'analog' ? 'block' : 'none';
    clockFlip.style.display = currentClockStyle === 'flip' ? 'flex' : 'none';
  }
  updateClockDisplay();

  clockStyleSelect.addEventListener('change', (e) => {
    currentClockStyle = e.target.value;
    localStorage.setItem('clock-style', currentClockStyle);
    updateClockDisplay();
  });

  // Background Theme
  const savedTheme = localStorage.getItem('theme-name') || 'theme-live-rgb';
  bgLayer.setAttribute('data-theme', savedTheme);
  const activeSwatch = Array.from(colorSwatches).find(s => s.dataset.theme === savedTheme);
  if (activeSwatch) activeSwatch.classList.add('active');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const themeName = swatch.dataset.theme;
      bgLayer.setAttribute('data-theme', themeName);
      localStorage.setItem('theme-name', themeName);
    });
  });

  // Glassmorphism Sliders
  opacitySlider.value = localStorage.getItem('glass-opacity') || 20;
  blurSlider.value = localStorage.getItem('glass-blur') || 16;
  
  function updateGlassProps() {
    const opacity = opacitySlider.value / 100;
    const blur = blurSlider.value;
    document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${opacity})`);
    document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
    localStorage.setItem('glass-opacity', opacitySlider.value);
    localStorage.setItem('glass-blur', blurSlider.value);
  }
  updateGlassProps();
  opacitySlider.addEventListener('input', updateGlassProps);
  blurSlider.addEventListener('input', updateGlassProps);

  // === 2. CLOCK ENGINE ===
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    // Digital
    let greeting = 'Good Evening';
    if (hours < 12) greeting = 'Good Morning';
    else if (hours < 18) greeting = 'Good Afternoon';
    
    const displayHours = hours.toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    timeEl.textContent = `${displayHours}:${displayMinutes}`;
    greetingEl.textContent = greeting;
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Flip
    flipHour.textContent = displayHours;
    flipMinute.textContent = displayMinutes;

    // Analog
    const hourDeg = (hours % 12) * 30 + (minutes * 0.5);
    const minuteDeg = minutes * 6 + (seconds * 0.1);
    const secondDeg = seconds * 6;
    
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // === 3. SIDEBARS & MODALS TOGGLING ===
  function closeAllPanels() {
    settingsSidebar.classList.remove('active');
    todoSidebar.classList.remove('active');
    devToolsSidebar.classList.remove('active');
    aiHistorySidebar.classList.remove('active');
    browserHistorySidebar.classList.remove('active');
    notesSidebar.classList.remove('active');
    aiSelector.classList.remove('active');
  }

  function togglePanel(panel) {
    const isActive = panel.classList.contains('active');
    closeAllPanels();
    if (!isActive) panel.classList.add('active');
  }

  settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(settingsSidebar); });
  todoBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(todoSidebar); });
  devToolsBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(devToolsSidebar); });
  aiHistoryBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(aiHistorySidebar); });
  browserHistoryBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(browserHistorySidebar); });
  notesBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(notesSidebar); });

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllPanels);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.side-panel') && !e.target.closest('.settings-sidebar') && !e.target.closest('.icon-btn') && !e.target.closest('.todo-btn') && !e.target.closest('.settings-btn')) {
      closeAllPanels();
    }
  });

  aboutBtn.addEventListener('click', () => aboutModal.classList.add('active'));
  document.getElementById('close-about-btn').addEventListener('click', () => aboutModal.classList.remove('active'));

  // === 4. SHORTCUT MANAGER ===
  const shortcutsContainer = document.getElementById('shortcuts-container');
  const shortcutForm = document.getElementById('shortcut-form');
  const cancelShortcutBtn = document.getElementById('cancel-shortcut');

  let shortcuts = JSON.parse(localStorage.getItem('custom-shortcuts')) || [
    { name: 'YouTube', url: 'https://youtube.com', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64' },
    { name: 'GitHub', url: 'https://github.com', icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64' }
  ];

  function renderShortcuts() {
    shortcutsContainer.innerHTML = '';
    shortcuts.forEach((sc, index) => {
      const a = document.createElement('a');
      a.href = sc.url;
      a.className = 'shortcut-item';
      a.innerHTML = `
        <div class="icon-wrapper glass">
          <img src="${sc.icon}" width="32" height="32" style="border-radius:8px;" onerror="this.style.display='none'">
        </div>
        <span>${sc.name}</span>
        <button class="delete-shortcut" data-index="${index}" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:12px; cursor:pointer; display:none; z-index:10;">×</button>
      `;
      
      // Delete functionality on hover
      a.style.position = 'relative';
      a.onmouseenter = () => a.querySelector('.delete-shortcut').style.display = 'block';
      a.onmouseleave = () => a.querySelector('.delete-shortcut').style.display = 'none';
      a.querySelector('.delete-shortcut').onclick = (e) => {
        e.preventDefault();
        shortcuts.splice(index, 1);
        localStorage.setItem('custom-shortcuts', JSON.stringify(shortcuts));
        renderShortcuts();
      };
      
      shortcutsContainer.appendChild(a);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'shortcut-item add-shortcut';
    addBtn.innerHTML = `
      <div class="icon-wrapper glass">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </div>
      <span>Add shortcut</span>
    `;
    addBtn.onclick = () => shortcutModal.classList.add('active');
    shortcutsContainer.appendChild(addBtn);
  }
  renderShortcuts();

  cancelShortcutBtn.addEventListener('click', () => shortcutModal.classList.remove('active'));
  shortcutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = document.getElementById('shortcut-url').value;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    
    const domain = new URL(url).hostname;
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    shortcuts.push({
      name: document.getElementById('shortcut-name').value,
      url: url,
      icon: icon
    });
    localStorage.setItem('custom-shortcuts', JSON.stringify(shortcuts));
    renderShortcuts();
    shortcutForm.reset();
    shortcutModal.classList.remove('active');
  });

  // === 5. WEATHER INTEGRATION ===
  const toggleWeather = document.getElementById('toggle-weather');
  const toggleWeatherBg = document.getElementById('toggle-weather-bg');
  
  toggleWeather.checked = localStorage.getItem('weather-enabled') === 'true';
  toggleWeatherBg.checked = localStorage.getItem('weather-bg-enabled') === 'true';

  function fetchWeather() {
    if (!toggleWeather.checked) {
      weatherWidget.style.display = 'none';
      weatherBgLayer.style.background = '';
      return;
    }
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
        const data = await res.json();
        const weather = data.current_weather;
        
        weatherTemp.textContent = `${Math.round(weather.temperature)}°C`;
        weatherWidget.style.display = 'flex';

        // Set Icon based on WMO code
        let icon = '☀️';
        let bgStyle = '';
        const code = weather.weathercode;
        if (code === 0) { icon = '☀️'; bgStyle = ''; } // Clear
        else if (code >= 1 && code <= 3) { icon = '⛅'; bgStyle = ''; } // Cloudy
        else if (code >= 51 && code <= 67) { icon = '🌧️'; bgStyle = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'50\' opacity=\'0.2\'%3E%3Cline x1=\'0\' y1=\'0\' x2=\'0\' y2=\'30\' stroke=\'%23fff\' stroke-width=\'2\'/%3E%3C/svg%3E")'; } // Rain
        else if (code >= 71 && code <= 77) { icon = '❄️'; bgStyle = 'radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2px)'; } // Snow
        else if (code >= 95) { icon = '⛈️'; } // Thunderstorm
        
        weatherIcon.textContent = icon;
        
        if (toggleWeatherBg.checked) {
          weatherBgLayer.style.background = bgStyle;
          weatherBgLayer.style.backgroundSize = code >= 71 && code <= 77 ? '50px 50px' : 'auto';
        } else {
          weatherBgLayer.style.background = '';
        }

      } catch (err) {
        console.error("Weather error:", err);
      }
    });
  }

  toggleWeather.addEventListener('change', (e) => {
    localStorage.setItem('weather-enabled', e.target.checked);
    fetchWeather();
  });
  toggleWeatherBg.addEventListener('change', (e) => {
    localStorage.setItem('weather-bg-enabled', e.target.checked);
    fetchWeather();
  });
  
  if (toggleWeather.checked) fetchWeather();

  // === 6. CUSTOM MEDIA BACKGROUND (IndexedDB) ===
  const bgUpload = document.getElementById('custom-bg-upload');
  const uploadBgBtn = document.getElementById('upload-bg-btn');
  const clearBgBtn = document.getElementById('clear-bg-btn');
  const customBgOpacity = document.getElementById('custom-bg-opacity');

  // IndexedDB Setup for large files
  const dbName = "AntigravityDB";
  let db;
  const request = indexedDB.open(dbName, 1);
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('media')) {
      db.createObjectStore('media');
    }
  };
  request.onsuccess = (e) => {
    db = e.target.result;
    loadCustomBg();
  };

  uploadBgBtn.addEventListener('click', () => bgUpload.click());

  bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      
      const tx = db.transaction('media', 'readwrite');
      tx.objectStore('media').put({ data: dataUrl, type: file.type.startsWith('video') ? 'video' : 'image' }, 'customBg');
      
      tx.oncomplete = () => loadCustomBg();
    };
    reader.readAsDataURL(file);
  });

  function loadCustomBg() {
    if (!db) return;
    const tx = db.transaction('media', 'readonly');
    const req = tx.objectStore('media').get('customBg');
    req.onsuccess = () => {
      const result = req.result;
      if (result) {
        customBgLayer.innerHTML = '';
        if (result.type === 'video') {
          const video = document.createElement('video');
          video.src = result.data;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          customBgLayer.appendChild(video);
        } else {
          customBgLayer.style.backgroundImage = `url(${result.data})`;
        }
        clearBgBtn.style.display = 'block';
      } else {
        customBgLayer.innerHTML = '';
        customBgLayer.style.backgroundImage = 'none';
        clearBgBtn.style.display = 'none';
      }
    };
  }

  clearBgBtn.addEventListener('click', () => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').delete('customBg');
    tx.oncomplete = () => loadCustomBg();
  });

  customBgOpacity.value = localStorage.getItem('custom-bg-opacity') || 100;
  customBgLayer.style.opacity = customBgOpacity.value / 100;
  customBgOpacity.addEventListener('input', (e) => {
    customBgLayer.style.opacity = e.target.value / 100;
    localStorage.setItem('custom-bg-opacity', e.target.value);
  });

  // === 7. NATIVE AI CHAT ENGINE ===
  const aiChatOverlay = document.getElementById('ai-chat-overlay');
  const closeAiChat = document.getElementById('close-ai-chat');
  const aiChatBody = document.getElementById('ai-chat-body');
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  
  const openaiKey = document.getElementById('openai-key');
  const geminiKey = document.getElementById('gemini-key');
  const anthropicKey = document.getElementById('anthropic-key');
  const saveKeysBtn = document.getElementById('save-keys-btn');

  // Load Keys
  openaiKey.value = localStorage.getItem('openai-key') || '';
  geminiKey.value = localStorage.getItem('gemini-key') || '';
  anthropicKey.value = localStorage.getItem('anthropic-key') || '';

  saveKeysBtn.addEventListener('click', () => {
    localStorage.setItem('openai-key', openaiKey.value.trim());
    localStorage.setItem('gemini-key', geminiKey.value.trim());
    localStorage.setItem('anthropic-key', anthropicKey.value.trim());
    saveKeysBtn.textContent = "Saved!";
    setTimeout(() => saveKeysBtn.textContent = "Save Keys", 2000);
  });

  // Setup AI Selector
  let currentAi = localStorage.getItem('selected-ai') || 'google';
  const setAiIcon = (aiName) => {
    let svgString = '';
    let src = '';
    if (aiName === 'google') {
      src = 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
    }
    else if (aiName === 'chatgpt') {
      svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10a37f" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>';
    }
    else if (aiName === 'gemini') {
      svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4285f4" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
    }
    else if (aiName === 'claude') {
      svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97757" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
    }
    else if (aiName === 'anthropic') {
      svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    if (svgString) {
      src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
    }
    
    currentAiIcon.src = src;
    searchInput.placeholder = aiName === 'google' ? "Search Google..." : "Ask " + aiName.charAt(0).toUpperCase() + aiName.slice(1) + "...";
  };
  setAiIcon(currentAi);

  aiSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    aiSelector.classList.toggle('active');
  });

  aiOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      currentAi = option.dataset.ai;
      localStorage.setItem('selected-ai', currentAi);
      setAiIcon(currentAi);
      aiSelector.classList.remove('active');
      searchInput.focus();
    });
  });

  // History Store
  let aiHistory = JSON.parse(localStorage.getItem('ai-history')) || [];
  const aiHistoryList = document.getElementById('ai-history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  function renderHistory() {
    aiHistoryList.innerHTML = '';
    aiHistory.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-title">${item.prompt}</div>
        <div class="history-date">${new Date(item.date).toLocaleString()} - ${item.model}</div>
      `;
      div.onclick = () => {
        aiChatOverlay.classList.add('active');
        aiChatBody.innerHTML = '';
        appendMessage('user', item.prompt);
        appendMessage('ai', item.response);
      };
      aiHistoryList.appendChild(div);
    });
  }
  renderHistory();

  clearHistoryBtn.addEventListener('click', () => {
    aiHistory = [];
    localStorage.setItem('ai-history', JSON.stringify([]));
    renderHistory();
  });

  function saveHistory(prompt, response, model) {
    aiHistory.unshift({ prompt, response, model, date: Date.now() });
    if(aiHistory.length > 50) aiHistory.pop();
    localStorage.setItem('ai-history', JSON.stringify(aiHistory));
    renderHistory();
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    // Use marked if available, otherwise raw text
    if (typeof marked !== 'undefined') {
      div.innerHTML = marked.parse(text);
    } else {
      div.textContent = text;
    }
    aiChatBody.appendChild(div);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }

  closeAiChat.addEventListener('click', () => aiChatOverlay.classList.remove('active'));

  // Main Form Submit Handler
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    // Check if we should use Native AI or Fallback URL
    const keyOpenAI = localStorage.getItem('openai-key');
    const keyGemini = localStorage.getItem('gemini-key');
    const keyAnthropic = localStorage.getItem('anthropic-key');

    let useNative = false;
    if (currentAi === 'chatgpt' && keyOpenAI) useNative = true;
    if (currentAi === 'gemini' && keyGemini) useNative = true;
    if (currentAi === 'claude' && keyAnthropic) useNative = true;

    if (currentAi === 'google' || !useNative) {
      // FALLBACK TO URL
      let url = '';
      if (currentAi === 'google') {
        const isUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(query);
        url = isUrl && !query.includes(' ') ? (/^https?:\/\//i.test(query) ? query : 'http://' + query) : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      } else if (currentAi === 'chatgpt') {
        url = `https://chatgpt.com/?q=${encodeURIComponent(query)}`;
      } else if (currentAi === 'gemini') {
        url = `https://gemini.google.com/app?q=${encodeURIComponent(query)}`;
      } else if (currentAi === 'claude') {
        url = `https://claude.ai/new?q=${encodeURIComponent(query)}`;
      } else if (currentAi === 'anthropic') { // fallback for perplexity
        url = `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`;
      }
      window.location.href = url;
      return;
    }

    // NATIVE AI MODE
    searchInput.value = '';
    aiChatOverlay.classList.add('active');
    aiChatBody.innerHTML = '';
    appendMessage('user', query);
    appendMessage('ai', 'Thinking...');

    try {
      let responseText = '';
      
      // Build Context Memory
      const contextMessages = [];
      const historyContext = aiHistory.slice(0, 5).reverse(); // Get last 5 interactions
      historyContext.forEach(h => {
        if(h.model === currentAi) {
          if(currentAi === 'chatgpt' || currentAi === 'claude') {
            contextMessages.push({role: 'user', content: h.prompt});
            contextMessages.push({role: 'assistant', content: h.response});
          } else if (currentAi === 'gemini') {
            contextMessages.push({role: 'user', parts: [{text: h.prompt}]});
            contextMessages.push({role: 'model', parts: [{text: h.response}]});
          }
        }
      });

      if (currentAi === 'chatgpt') {
        const messages = [...contextMessages, {role: 'user', content: query}];
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keyOpenAI}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: messages })
        });
        const data = await res.json();
        responseText = data.choices[0].message.content;
      } 
      else if (currentAi === 'gemini') {
        const contents = [...contextMessages, {role: 'user', parts: [{text: query}]}];
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyGemini}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: contents })
        });
        const data = await res.json();
        responseText = data.candidates[0].content.parts[0].text;
      }
      else if (currentAi === 'claude') {
        const messages = [...contextMessages, {role: 'user', content: query}];
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': keyAnthropic, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 1024, messages: messages })
        });
        const data = await res.json();
        responseText = data.content[0].text;
      }

      // Remove "Thinking..." and show result
      aiChatBody.lastChild.remove();
      appendMessage('ai', responseText);
      saveHistory(query, responseText, currentAi);

    } catch (err) {
      aiChatBody.lastChild.remove();
      appendMessage('ai', `**Error:** Could not fetch response. Check your API key. \n\nDetails: ${err.message}`);
    }
  });

  aiChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = aiChatInput.value.trim();
    if (query) {
      aiChatInput.value = '';
      // Simply trigger the main search logic with the follow-up
      searchInput.value = query;
      searchForm.dispatchEvent(new Event('submit'));
    }
  });


  // === 8. DEV TOOLS ===
  const formatJsonBtn = document.getElementById('format-json-btn');
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  
  formatJsonBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(jsonInput.value);
      jsonOutput.textContent = JSON.stringify(parsed, null, 2);
    } catch(e) {
      jsonOutput.textContent = "Invalid JSON: " + e.message;
    }
  });

  const base64Input = document.getElementById('base64-input');
  const base64Output = document.getElementById('base64-output');
  
  document.getElementById('encode-btn').addEventListener('click', () => {
    try { base64Output.value = btoa(base64Input.value); } catch(e) { base64Output.value = e.message; }
  });
  document.getElementById('decode-btn').addEventListener('click', () => {
    try { base64Output.value = atob(base64Input.value); } catch(e) { base64Output.value = e.message; }
  });

  // To-Do Logic (Keep existing functionality)
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.done ? 'done' : ''}`;
      li.innerHTML = `<span class="todo-text">${task.text}</span><button class="todo-delete">×</button>`;
      
      li.querySelector('.todo-text').onclick = () => { tasks[index].done = !tasks[index].done; saveTasks(); };
      li.querySelector('.todo-delete').onclick = () => { tasks.splice(index, 1); saveTasks(); };
      todoList.appendChild(li);
    });
  }
  function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); renderTasks(); }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (todoInput.value.trim()) {
      tasks.push({ text: todoInput.value.trim(), done: false });
      todoInput.value = '';
      saveTasks();
    }
  });
  renderTasks();

  // === 9. QUICK NOTES ===
  const quickNotesInput = document.getElementById('quick-notes-input');
  quickNotesInput.value = localStorage.getItem('quick-notes') || '';
  quickNotesInput.addEventListener('input', (e) => {
    localStorage.setItem('quick-notes', e.target.value);
  });

  // === 10. POMODORO TIMER ===
  let pomodoroInterval;
  let pomodoroTime = 25 * 60; // 25 mins
  let isFocusMode = true;
  let isTimerRunning = false;
  const pomodoroTimeEl = document.getElementById('pomodoro-time');
  const pomodoroStartBtn = document.getElementById('pomodoro-start');
  const pomodoroResetBtn = document.getElementById('pomodoro-reset');
  const pomodoroHeaderSpan = document.querySelector('.pomodoro-header span');

  function updatePomodoroDisplay() {
    const m = Math.floor(pomodoroTime / 60).toString().padStart(2, '0');
    const s = (pomodoroTime % 60).toString().padStart(2, '0');
    pomodoroTimeEl.textContent = `${m}:${s}`;
  }

  pomodoroStartBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(pomodoroInterval);
      pomodoroStartBtn.textContent = 'Resume';
    } else {
      pomodoroStartBtn.textContent = 'Pause';
      pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updatePomodoroDisplay();
        if (pomodoroTime <= 0) {
          clearInterval(pomodoroInterval);
          isFocusMode = !isFocusMode;
          pomodoroTime = isFocusMode ? 25 * 60 : 5 * 60;
          pomodoroHeaderSpan.textContent = isFocusMode ? 'Focus' : 'Break';
          isTimerRunning = false;
          pomodoroStartBtn.textContent = 'Start';
          updatePomodoroDisplay();
          // notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(isFocusMode ? 'Break over! Back to work.' : 'Focus session complete! Take a break.');
          }
        }
      }, 1000);
    }
    isTimerRunning = !isTimerRunning;
  });

  pomodoroResetBtn.addEventListener('click', () => {
    clearInterval(pomodoroInterval);
    isTimerRunning = false;
    isFocusMode = true;
    pomodoroTime = 25 * 60;
    pomodoroHeaderSpan.textContent = 'Focus';
    pomodoroStartBtn.textContent = 'Start';
    updatePomodoroDisplay();
  });

  // Request notification permission
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // === 11. ZEN SOUNDS ===
  const soundBtns = document.querySelectorAll('.sound-btn');
  const soundVolume = document.getElementById('sound-volume');
  let currentAudio = null;
  let currentSound = null;

  const soundSources = {
    rain: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3', // Free Rain
    fire: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_34d164cf3f.mp3', // Free Fire
    coffee: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_82e85a5369.mp3' // Free Cafe
  };

  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.sound;
      
      if (currentSound === type) {
        // Pause if already playing
        currentAudio.pause();
        currentAudio = null;
        currentSound = null;
        btn.classList.remove('active');
        return;
      }
      
      // Stop existing
      if (currentAudio) {
        currentAudio.pause();
        soundBtns.forEach(b => b.classList.remove('active'));
      }
      
      // Play new
      currentAudio = new Audio(soundSources[type]);
      currentAudio.loop = true;
      currentAudio.volume = soundVolume.value / 100;
      currentAudio.play().catch(e => console.error("Audio playback failed:", e));
      currentSound = type;
      btn.classList.add('active');
    });
  });

  soundVolume.addEventListener('input', (e) => {
    if (currentAudio) currentAudio.volume = e.target.value / 100;
  });

  // === 12. ONBOARDING GUIDE ===
  const onboardingModal = document.getElementById('onboarding-modal');
  if (!localStorage.getItem('glassy-onboarded')) {
    onboardingModal.classList.add('active');
  }

  let currentStep = 1;
  const totalSteps = 4;
  function updateOnboarding() {
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById(`onboarding-step-${i}`).style.display = i === currentStep ? 'block' : 'none';
      const dot = document.getElementById(`dot-${i}`);
      if(i === currentStep) {
        dot.style.background = 'white';
        dot.classList.add('active');
      } else {
        dot.style.background = 'rgba(255,255,255,0.3)';
        dot.classList.remove('active');
      }
    }
  }

  document.getElementById('ob-next-1').addEventListener('click', () => { currentStep=2; updateOnboarding(); });
  document.getElementById('ob-next-2').addEventListener('click', () => { currentStep=3; updateOnboarding(); });
  document.getElementById('ob-next-3').addEventListener('click', () => { currentStep=4; updateOnboarding(); });
  document.getElementById('ob-finish').addEventListener('click', () => {
    localStorage.setItem('glassy-onboarded', 'true');
    onboardingModal.classList.remove('active');
  });

  // === 13. BROWSER TABS & HISTORY (Requires Permissions) ===
  const browserHistoryList = document.getElementById('browser-history-list');
  
  function fetchBrowserHistory() {
    browserHistoryList.innerHTML = '<p style="font-size:0.8rem; color:white; text-align:center;">Loading history...</p>';
    
    // Check if chrome.history API is available
    if (typeof chrome !== 'undefined' && chrome.history) {
      chrome.history.search({text: '', maxResults: 15}, (results) => {
        browserHistoryList.innerHTML = '<h3 style="font-size:0.9rem; margin-bottom:10px; color:rgba(255,255,255,0.8);">Recent Sites</h3>';
        results.forEach(item => {
          const div = document.createElement('a');
          div.className = 'history-item';
          div.href = item.url;
          div.innerHTML = `
            <div class="history-title">${item.title || item.url}</div>
            <div class="history-date">${new Date(item.lastVisitTime).toLocaleString()}</div>
          `;
          browserHistoryList.appendChild(div);
        });
      });
      
      if (chrome.sessions) {
        chrome.sessions.getRecentlyClosed({maxResults: 5}, (sessions) => {
          const title = document.createElement('h3');
          title.style = "font-size:0.9rem; margin:15px 0 10px 0; color:rgba(255,255,255,0.8);";
          title.textContent = "Recently Closed Tabs";
          browserHistoryList.insertBefore(title, browserHistoryList.firstChild);
          
          sessions.reverse().forEach(session => {
            if(session.tab) {
              const div = document.createElement('a');
              div.className = 'history-item';
              div.href = session.tab.url;
              div.innerHTML = `<div class="history-title">↩️ ${session.tab.title}</div>`;
              browserHistoryList.insertBefore(div, title.nextSibling);
            }
          });
        });
      }
    } else {
      browserHistoryList.innerHTML = '<p style="font-size:0.8rem; color:rgba(255,255,255,0.7); text-align:center; padding: 20px;">Cannot access browser history. Please ensure the extension has "tabs", "sessions", and "history" permissions in manifest.json and is running as a Chrome Extension.</p>';
    }
  }

  browserHistoryBtn.addEventListener('click', fetchBrowserHistory);

  // === 14. VOICE SEARCH (JARVIS MODE) ===
  const micBtn = document.getElementById('mic-btn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    let isListening = false;

    recognition.onstart = function() {
      isListening = true;
      micBtn.classList.add('listening');
      searchInput.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      // Auto-submit
      searchForm.dispatchEvent(new Event('submit'));
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error", event.error);
      micBtn.classList.remove('listening');
      searchInput.placeholder = "Search or ask AI...";
    };

    recognition.onend = function() {
      isListening = false;
      micBtn.classList.remove('listening');
      if(searchInput.value === '') {
        searchInput.placeholder = "Search or ask AI...";
      }
    };

    micBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    // Hide mic button if browser doesn't support Web Speech API
    if(micBtn) micBtn.style.display = 'none';
  }

});
