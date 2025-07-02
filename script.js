// S.O.M.A. - Smart Omnipresent Mobile Assistant
// Main Application Script

class SOMAAssistant {
    constructor() {
        this.version = '1.0.0';
        this.currentLanguage = 'ru';
        this.interfaceMode = 'graphical';
        this.voiceActivation = true;
        this.autoLearning = true;
        this.isListening = false;
        this.isRecording = false;
        this.aiAgents = [];
        this.userInteractions = [];
        this.deviceStates = {};
        
        // Initialize components
        this.initializeLanguages();
        this.initializeVoiceRecognition();
        this.initializeEventListeners();
        this.initializeLocalStorage();
        this.updateInterface();
        
        console.log('S.O.M.A. Assistant initialized successfully');
        this.showNotification('S.O.M.A. готов к работе!', 'success');
    }

    // Language system
    initializeLanguages() {
        this.languages = {
            ru: {
                greeting: 'Привет! Я S.O.M.A. - ваш умный AI-ассистент.',
                ready: 'Готов к работе',
                listening: 'Слушаю...',
                processing: 'Обрабатываю...',
                create_content: 'Создать контент',
                smart_home: 'Умный дом',
                create_ai: 'Создать AI',
                data_analysis: 'Анализ данных',
                calendar: 'Календарь',
                settings: 'Настройки',
                language: 'Язык',
                interface_mode: 'Режим интерфейса',
                voice_activation: 'Голосовая активация',
                auto_learning: 'Самообучение',
                voice_commands: {
                    activate: ['soma', 'сома'],
                    create_content: ['создай контент', 'создать контент'],
                    create_ai: ['создай ai', 'создать ai', 'новый ai'],
                    smart_home: ['умный дом', 'управление домом'],
                    analysis: ['анализ данных', 'анализ'],
                    calendar: ['календарь', 'расписание'],
                    settings: ['настройки', 'параметры']
                }
            },
            en: {
                greeting: 'Hello! I\'m S.O.M.A. - your smart AI assistant.',
                ready: 'Ready to work',
                listening: 'Listening...',
                processing: 'Processing...',
                create_content: 'Create Content',
                smart_home: 'Smart Home',
                create_ai: 'Create AI',
                data_analysis: 'Data Analysis',
                calendar: 'Calendar',
                settings: 'Settings',
                language: 'Language',
                interface_mode: 'Interface Mode',
                voice_activation: 'Voice Activation',
                auto_learning: 'Auto Learning',
                voice_commands: {
                    activate: ['soma'],
                    create_content: ['create content', 'generate content'],
                    create_ai: ['create ai', 'new ai', 'make ai'],
                    smart_home: ['smart home', 'home control'],
                    analysis: ['data analysis', 'analyze'],
                    calendar: ['calendar', 'schedule'],
                    settings: ['settings', 'preferences']
                }
            },
            it: {
                greeting: 'Ciao! Sono S.O.M.A. - il tuo assistente AI intelligente.',
                ready: 'Pronto per lavorare',
                listening: 'Ascolto...',
                processing: 'Elaborazione...',
                create_content: 'Crea Contenuto',
                smart_home: 'Casa Intelligente',
                create_ai: 'Crea AI',
                data_analysis: 'Analisi Dati',
                calendar: 'Calendario',
                settings: 'Impostazioni',
                language: 'Lingua',
                interface_mode: 'Modalità Interfaccia',
                voice_activation: 'Attivazione Vocale',
                auto_learning: 'Apprendimento Automatico',
                voice_commands: {
                    activate: ['soma'],
                    create_content: ['crea contenuto'],
                    create_ai: ['crea ai', 'nuovo ai'],
                    smart_home: ['casa intelligente'],
                    analysis: ['analisi dati'],
                    calendar: ['calendario'],
                    settings: ['impostazioni']
                }
            },
            az: {
                greeting: 'Salam! Mən S.O.M.A. - sizin ağıllı AI köməkçinizəm.',
                ready: 'İşə hazıram',
                listening: 'Dinləyirəm...',
                processing: 'Emal edirəm...',
                create_content: 'Məzmun Yarat',
                smart_home: 'Ağıllı Ev',
                create_ai: 'AI Yarat',
                data_analysis: 'Məlumat Analizi',
                calendar: 'Təqvim',
                settings: 'Parametrlər',
                language: 'Dil',
                interface_mode: 'İnterfeys Rejimi',
                voice_activation: 'Səs Aktivasiyası',
                auto_learning: 'Avto Öyrənmə',
                voice_commands: {
                    activate: ['soma'],
                    create_content: ['məzmun yarat'],
                    create_ai: ['ai yarat'],
                    smart_home: ['ağıllı ev'],
                    analysis: ['məlumat analizi'],
                    calendar: ['təqvim'],
                    settings: ['parametrlər']
                }
            }
        };
    }

    // Voice Recognition System
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = this.getVoiceLanguageCode();
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus();
                console.log('Voice recognition started');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    this.processVoiceCommand(finalTranscript.toLowerCase().trim());
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceStatus();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceStatus();
                if (this.voiceActivation) {
                    setTimeout(() => this.startListening(), 1000);
                }
            };
            
            if (this.voiceActivation) {
                this.startListening();
            }
        } else {
            console.warn('Speech recognition not supported');
            this.showNotification('Голосовое управление не поддерживается в этом браузере', 'warning');
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting voice recognition:', error);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command received:', command);
        const currentLang = this.languages[this.currentLanguage];
        
        // Check for activation keyword
        if (currentLang.voice_commands.activate.some(keyword => command.includes(keyword))) {
            this.activateVoiceMode(command);
            return;
        }
        
        // Process other commands
        if (currentLang.voice_commands.create_content.some(cmd => command.includes(cmd))) {
            this.openPanel('content');
        } else if (currentLang.voice_commands.create_ai.some(cmd => command.includes(cmd))) {
            this.openPanel('ai');
        } else if (currentLang.voice_commands.smart_home.some(cmd => command.includes(cmd))) {
            this.openPanel('smart-home');
        } else if (currentLang.voice_commands.analysis.some(cmd => command.includes(cmd))) {
            this.performDataAnalysis();
        } else if (currentLang.voice_commands.calendar.some(cmd => command.includes(cmd))) {
            this.openCalendar();
        } else if (currentLang.voice_commands.settings.some(cmd => command.includes(cmd))) {
            this.openPanel('settings');
        } else {
            // General conversation
            this.processUserMessage(command, true);
        }
    }

    activateVoiceMode(command) {
        this.showNotification('SOMA активирован! Говорите...', 'success');
        this.updateAvatarState('active');
        
        // Remove activation keyword and process remaining command
        const activationKeywords = this.languages[this.currentLanguage].voice_commands.activate;
        let cleanCommand = command;
        activationKeywords.forEach(keyword => {
            cleanCommand = cleanCommand.replace(new RegExp(keyword, 'gi'), '').trim();
        });
        
        if (cleanCommand) {
            this.processUserMessage(cleanCommand, true);
        }
        
        setTimeout(() => this.updateAvatarState('ready'), 3000);
    }

    // Event Listeners
    initializeEventListeners() {
        // Chat input
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const voiceBtn = document.getElementById('voice-btn');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        
        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Panel management
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const panel = e.currentTarget.dataset.panel;
                this.closePanel(panel);
            });
        });
        
        // Settings
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        document.getElementById('interface-mode').addEventListener('change', (e) => {
            this.changeInterfaceMode(e.target.value);
        });
        
        document.getElementById('voice-activation').addEventListener('change', (e) => {
            this.toggleVoiceActivation(e.target.checked);
        });
        
        document.getElementById('auto-learning').addEventListener('change', (e) => {
            this.autoLearning = e.target.checked;
            this.saveSettings();
        });
        
        // Content creation
        document.getElementById('generate-content').addEventListener('click', () => {
            this.generateContent();
        });
        
        // AI creation
        document.getElementById('create-ai').addEventListener('click', () => {
            this.createAIAgent();
        });
        
        // Smart home controls
        document.querySelectorAll('.device-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateDeviceValue(e.target, e.target.value);
            });
        });
        
        document.querySelectorAll('.device-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.toggleDevice(e.target);
            });
        });
    }

    // Message handling
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            this.processUserMessage(message);
        }
    }

    processUserMessage(message, isVoice = false) {
        this.showLoading();
        
        // Store interaction for learning
        this.userInteractions.push({
            message,
            timestamp: new Date(),
            isVoice,
            language: this.currentLanguage
        });
        
        // Simulate AI processing
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'ai');
            this.hideLoading();
            
            if (isVoice) {
                this.speakResponse(response);
            }
            
            if (this.autoLearning) {
                this.learnFromInteraction(message, response);
            }
        }, 1000 + Math.random() * 2000);
    }

    generateAIResponse(message) {
        const responses = {
            ru: [
                'Понимаю ваш запрос. Позвольте мне помочь вам с этим.',
                'Интересный вопрос! Я анализирую доступную информацию...',
                'Я обрабатываю ваш запрос с помощью всех доступных модулей.',
                'Хороший запрос! Вот что я могу предложить...',
                'Используя свои когнитивные способности, я предлагаю следующее решение...'
            ],
            en: [
                'I understand your request. Let me help you with this.',
                'Interesting question! I\'m analyzing available information...',
                'I\'m processing your request using all available modules.',
                'Good question! Here\'s what I can suggest...',
                'Using my cognitive abilities, I propose the following solution...'
            ]
        };
        
        const langResponses = responses[this.currentLanguage] || responses.en;
        const baseResponse = langResponses[Math.floor(Math.random() * langResponses.length)];
        
        // Add contextual responses based on keywords
        if (message.toLowerCase().includes('помощь') || message.toLowerCase().includes('help')) {
            return `${baseResponse} Я могу помочь вам с созданием контента, управлением умным домом, анализом данных и многим другим. Используйте быстрые действия или голосовые команды для доступа к функциям.`;
        }
        
        if (message.toLowerCase().includes('время') || message.toLowerCase().includes('time')) {
            const now = new Date();
            return `Текущее время: ${now.toLocaleTimeString()} (${now.toLocaleDateString()})`;
        }
        
        return baseResponse;
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (type === 'ai') {
            messageContent.innerHTML = `<i class="fas fa-robot"></i><span>${content}</span>`;
        } else {
            messageContent.innerHTML = `<i class="fas fa-user"></i><span>${content}</span>`;
        }
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Quick Actions
    handleQuickAction(action) {
        switch (action) {
            case 'create-content':
                this.openPanel('content');
                break;
            case 'smart-home':
                this.openPanel('smart-home');
                break;
            case 'create-ai':
                this.openPanel('ai');
                break;
            case 'data-analysis':
                this.performDataAnalysis();
                break;
            case 'calendar':
                this.openCalendar();
                break;
            case 'settings':
                this.openPanel('settings');
                break;
        }
    }

    // Panel Management
    openPanel(panelName) {
        // Close all panels first
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Open the requested panel
        const panel = document.getElementById(`${panelName}-panel`);
        if (panel) {
            panel.classList.add('active');
        }
    }

    closePanel(panelName) {
        const panel = document.getElementById(`${panelName}-panel`);
        if (panel) {
            panel.classList.remove('active');
        }
    }

    // Content Creation
    generateContent() {
        const description = document.getElementById('content-description').value;
        if (!description) {
            this.showNotification('Пожалуйста, опишите что нужно создать', 'warning');
            return;
        }
        
        this.showLoading();
        
        // Simulate content generation
        setTimeout(() => {
            const contentTypes = ['статья', 'презентация', 'веб-сайт', 'дизайн-макет'];
            const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
            
            const response = `Создаю ${randomType} на основе вашего описания: "${description}". Контент будет готов через несколько минут. Я использую современные AI алгоритмы для создания качественного материала.`;
            
            this.addMessage(response, 'ai');
            this.hideLoading();
            this.showNotification('Контент создается...', 'success');
            
            document.getElementById('content-description').value = '';
        }, 2000);
    }

    // AI Agent Creation
    createAIAgent() {
        const name = document.getElementById('ai-name').value;
        const purpose = document.getElementById('ai-purpose').value;
        const type = document.getElementById('ai-type').value;
        
        if (!name || !purpose) {
            this.showNotification('Заполните все поля для создания AI агента', 'warning');
            return;
        }
        
        const aiAgent = {
            id: Date.now(),
            name,
            purpose,
            type,
            created: new Date(),
            status: 'active'
        };
        
        this.aiAgents.push(aiAgent);
        this.updateAIAgentsList();
        this.updateAIAgentsCount();
        
        // Clear form
        document.getElementById('ai-name').value = '';
        document.getElementById('ai-purpose').value = '';
        
        this.showNotification(`AI агент "${name}" успешно создан!`, 'success');
        this.addMessage(`Создан новый AI агент "${name}" типа "${type}". Агент готов к работе и будет помогать с задачами: ${purpose}`, 'ai');
    }

    updateAIAgentsList() {
        const listContainer = document.getElementById('ai-agents-list');
        const existingList = listContainer.querySelector('.agents-container');
        if (existingList) {
            existingList.remove();
        }
        
        if (this.aiAgents.length === 0) return;
        
        const agentsContainer = document.createElement('div');
        agentsContainer.className = 'agents-container';
        
        this.aiAgents.forEach(agent => {
            const agentDiv = document.createElement('div');
            agentDiv.className = 'ai-agent-item';
            agentDiv.innerHTML = `
                <div class="ai-agent-info">
                    <div class="ai-agent-name">${agent.name}</div>
                    <div class="ai-agent-type">${agent.type} - ${agent.purpose}</div>
                </div>
                <div class="ai-agent-actions">
                    <button onclick="soma.interactWithAI(${agent.id})" title="Взаимодействовать">
                        <i class="fas fa-comments"></i>
                    </button>
                    <button onclick="soma.removeAIAgent(${agent.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            agentsContainer.appendChild(agentDiv);
        });
        
        listContainer.appendChild(agentsContainer);
    }

    updateAIAgentsCount() {
        document.getElementById('ai-agents-count').textContent = `${this.aiAgents.length} AI`;
    }

    interactWithAI(agentId) {
        const agent = this.aiAgents.find(a => a.id === agentId);
        if (agent) {
            this.addMessage(`Взаимодействую с AI агентом "${agent.name}". Агент специализируется на: ${agent.purpose}`, 'ai');
            this.closePanel('ai');
        }
    }

    removeAIAgent(agentId) {
        this.aiAgents = this.aiAgents.filter(a => a.id !== agentId);
        this.updateAIAgentsList();
        this.updateAIAgentsCount();
        this.showNotification('AI агент удален', 'success');
    }

    // Smart Home Controls
    updateDeviceValue(element, value) {
        const deviceCard = element.closest('.device-card');
        const deviceName = deviceCard.querySelector('span').textContent;
        
        this.deviceStates[deviceName] = value;
        this.showNotification(`${deviceName}: ${value}${deviceName === 'Температура' ? '°C' : '%'}`, 'success');
        
        // Simulate device control
        this.addMessage(`Устройство "${deviceName}" настроено на ${value}${deviceName === 'Температура' ? '°C' : '%'}`, 'ai');
    }

    toggleDevice(element) {
        const isActive = element.classList.contains('active');
        const deviceCard = element.closest('.device-card');
        const deviceName = deviceCard.querySelector('span').textContent;
        
        if (isActive) {
            element.classList.remove('active');
            element.textContent = 'ВЫКЛ';
            this.deviceStates[deviceName] = false;
        } else {
            element.classList.add('active');
            element.textContent = 'ВКЛ';
            this.deviceStates[deviceName] = true;
        }
        
        const status = isActive ? 'выключено' : 'включено';
        this.showNotification(`${deviceName} ${status}`, 'success');
        this.addMessage(`Устройство "${deviceName}" ${status}`, 'ai');
    }

    // Data Analysis
    performDataAnalysis() {
        this.showLoading();
        
        setTimeout(() => {
            const analysisResults = `
                📊 Результаты анализа данных:
                
                • Взаимодействий с пользователем: ${this.userInteractions.length}
                • Активных AI агентов: ${this.aiAgents.length}
                • Текущий язык: ${this.currentLanguage.toUpperCase()}
                • Режим интерфейса: ${this.interfaceMode}
                • Состояние устройств: ${Object.keys(this.deviceStates).length} устройств
                
                Система работает стабильно. Рекомендации: продолжайте использовать голосовое управление для повышения эффективности.
            `;
            
            this.addMessage(analysisResults, 'ai');
            this.hideLoading();
            this.showNotification('Анализ данных завершен', 'success');
        }, 2000);
    }

    // Calendar
    openCalendar() {
        const now = new Date();
        const calendarInfo = `
            📅 Календарь и планировщик:
            
            Текущая дата: ${now.toLocaleDateString()}
            Время: ${now.toLocaleTimeString()}
            
            Сегодняшние задачи:
            • 09:00 - Проверка системы S.O.M.A.
            • 14:00 - Обновление AI модулей
            • 18:00 - Анализ пользовательских взаимодействий
            
            Напоминание: Система самообучения активна и анализирует ваши предпочтения.
        `;
        
        this.addMessage(calendarInfo, 'ai');
        this.showNotification('Календарь открыт', 'success');
    }

    // Settings Management
    changeLanguage(newLanguage) {
        this.currentLanguage = newLanguage;
        this.updateInterface();
        this.saveSettings();
        
        if (this.recognition) {
            this.recognition.lang = this.getVoiceLanguageCode();
        }
        
        document.getElementById('current-language').textContent = newLanguage.toUpperCase();
        this.showNotification(`Язык изменен на ${newLanguage.toUpperCase()}`, 'success');
        
        // Add greeting in new language
        const greeting = this.languages[newLanguage].greeting;
        this.addMessage(greeting, 'ai');
    }

    changeInterfaceMode(mode) {
        this.interfaceMode = mode;
        this.saveSettings();
        this.showNotification(`Режим интерфейса: ${mode}`, 'success');
        
        if (mode === 'ar') {
            this.showNotification('AR режим в разработке', 'warning');
        }
    }

    toggleVoiceActivation(enabled) {
        this.voiceActivation = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.startListening();
            this.showNotification('Голосовая активация включена', 'success');
        } else {
            this.stopListening();
            this.showNotification('Голосовая активация выключена', 'warning');
        }
    }

    getVoiceLanguageCode() {
        const languageCodes = {
            ru: 'ru-RU',
            en: 'en-US',
            it: 'it-IT',
            az: 'az-AZ'
        };
        return languageCodes[this.currentLanguage] || 'en-US';
    }

    // Self-Learning System
    learnFromInteraction(userMessage, aiResponse) {
        // Simple learning mechanism - store patterns
        const learningData = {
            input: userMessage.toLowerCase(),
            output: aiResponse,
            language: this.currentLanguage,
            timestamp: new Date(),
            context: {
                interfaceMode: this.interfaceMode,
                activeAgents: this.aiAgents.length,
                deviceStates: {...this.deviceStates}
            }
        };
        
        // Store in learning database (localStorage for demo)
        const learningDB = JSON.parse(localStorage.getItem('soma_learning') || '[]');
        learningDB.push(learningData);
        
        // Keep only last 1000 interactions
        if (learningDB.length > 1000) {
            learningDB.splice(0, learningDB.length - 1000);
        }
        
        localStorage.setItem('soma_learning', JSON.stringify(learningDB));
        console.log('Learning from interaction:', learningData);
    }

    // Voice Input Toggle
    toggleVoiceInput() {
        const voiceBtn = document.getElementById('voice-btn');
        
        if (this.isRecording) {
            this.stopRecording();
            voiceBtn.classList.remove('recording');
        } else {
            this.startRecording();
            voiceBtn.classList.add('recording');
        }
    }

    startRecording() {
        this.isRecording = true;
        this.showNotification('Говорите...', 'success');
        // Voice recording would be implemented here
    }

    stopRecording() {
        this.isRecording = false;
        this.showNotification('Запись остановлена', 'warning');
        // Process recorded audio would be implemented here
    }

    // Text-to-Speech
    speakResponse(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getVoiceLanguageCode();
            utterance.rate = 0.9;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }

    // UI Updates
    updateInterface() {
        const currentLang = this.languages[this.currentLanguage];
        
        // Update AI subtitle
        document.getElementById('ai-subtitle').textContent = currentLang.ready;
        
        // Update translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (currentLang[key]) {
                element.textContent = currentLang[key];
            }
        });
    }

    updateVoiceStatus() {
        const voiceText = document.getElementById('voice-text');
        const voiceIcon = document.getElementById('voice-icon');
        const currentLang = this.languages[this.currentLanguage];
        
        if (this.isListening) {
            voiceText.textContent = currentLang.listening;
            voiceIcon.className = 'fas fa-microphone-alt';
        } else {
            voiceText.textContent = currentLang.ready;
            voiceIcon.className = 'fas fa-microphone';
        }
    }

    updateAvatarState(state) {
        const avatar = document.getElementById('ai-avatar');
        const subtitle = document.getElementById('ai-subtitle');
        const currentLang = this.languages[this.currentLanguage];
        
        avatar.className = `ai-avatar ${state}`;
        
        switch (state) {
            case 'active':
                subtitle.textContent = currentLang.listening;
                break;
            case 'processing':
                subtitle.textContent = currentLang.processing;
                break;
            default:
                subtitle.textContent = currentLang.ready;
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Loading States
    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
        this.updateAvatarState('processing');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
        this.updateAvatarState('ready');
    }

    // Local Storage
    initializeLocalStorage() {
        const settings = localStorage.getItem('soma_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.currentLanguage = parsed.language || 'ru';
            this.interfaceMode = parsed.interfaceMode || 'graphical';
            this.voiceActivation = parsed.voiceActivation !== false;
            this.autoLearning = parsed.autoLearning !== false;
        }
        
        // Load AI agents
        const agents = localStorage.getItem('soma_ai_agents');
        if (agents) {
            this.aiAgents = JSON.parse(agents);
            this.updateAIAgentsList();
            this.updateAIAgentsCount();
        }
        
        // Update UI with loaded settings
        document.getElementById('language-select').value = this.currentLanguage;
        document.getElementById('interface-mode').value = this.interfaceMode;
        document.getElementById('voice-activation').checked = this.voiceActivation;
        document.getElementById('auto-learning').checked = this.autoLearning;
    }

    saveSettings() {
        const settings = {
            language: this.currentLanguage,
            interfaceMode: this.interfaceMode,
            voiceActivation: this.voiceActivation,
            autoLearning: this.autoLearning
        };
        
        localStorage.setItem('soma_settings', JSON.stringify(settings));
        localStorage.setItem('soma_ai_agents', JSON.stringify(this.aiAgents));
    }
}

// Initialize S.O.M.A. when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.soma = new SOMAAssistant();
});

// Global functions for HTML onclick events
window.soma = null;