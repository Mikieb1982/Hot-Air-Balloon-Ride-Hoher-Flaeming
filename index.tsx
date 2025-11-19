


'use strict';

import { GoogleGenAI, Modality } from "@google/genai";

// Configuration
const CONFIG = {
    MAP_WIDTH: 2048,
    MAP_HEIGHT: 1448,
    START_X: 1364,
    START_Y: 605,
    MAX_SPEED: 2.5,
    ACCELERATION: 0.05,
    DRAG: 0.96,
    TURN_SPEED: 2.5,
    LANDING_RADIUS: 70,
    JOYSTICK_RADIUS: 55,
    MIN_ZOOM: 0.4,
    MAX_ZOOM: 1.5,
    ZOOM_STEP: 0.2,
};

// POI Data - Coordinates adjusted for precise map alignment
const POI_DATA = [
    { id: 1, name: "1. Stadt und Burg Ziesar", x: 472, y: 130, description: "Auf der Burg Ziesar befindet sich das Museum für brandenburgische Kirchen- und Kulturgeschichte des Mittelalters und der Reformationszeit. Sehenswert sind hier auch die Schlosskapelle, der sehr gut erhaltene Burgfried und der weite Blick vom Storchenturm über das Ziesarer Land.<br><br><a href=\"https://www.google.com/maps/place/Burg+Ziesar\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 2, name: "2. Gutspark Dahlen", x: 780, y: 355, description: "Der Gutspark Dahlen ist ein Ort seltener botanischer Vielfalt. Spaziergänge um den Schwanensee verzaubern die Besucher. Zudem können der Bauerngarten und Duftpflanzen besucht werden. Gleich gegenüber dem Gutspark steht, etwas verborgen, die Fachwerkkirche.<br><br><a href=\"https://www.google.com/maps/place/Gutspark+Dahlen\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 3, name: "3. Klein Briesener Bach", x: 995, y: 250, description: "Der Artesische Brunnen ist im Naturschutzgebiet Klein Briesener Bach zu finden. Das Wasser steigt hier durch den Eigendruck hervor und wird dem Briesener Bach zugeführt. Wanderer können dem schönen Bach auf dem Burgenwanderweg bis zum Aussichtsturm 'Schöne Aussicht' folgen.<br><br><a href=\"https://www.google.com/maps/place/Artesischer+Brunnen\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 4, name: "4. Paradies Dippmannsdorf", x: 1340, y: 275, description: "Hier vereinen sich einige Dutzend Quellen glasklaren Wassers, die den Mühlenbach speisen. Das von Buchen, Eichen und Birken umgebene Quellgebiet wurde durch Stege erschlossen. Ein Spaziergang lohnt sich zu jeder Jahreszeit und lässt sich gut mit einer Wanderung auf dem Paradiesweg verbinden.<br><br><a href=\"https://www.google.com/maps/place/Paradies\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 5, name: "5. Töpferort Görzke", x: 415, y: 495, description: "Ein Besuch der kleinen Museen und des Hofladens auf dem Handwerkerhof sowie die Einkaufsmöglichkeiten in den Töpfereien erfreuen die Besucher des Flämingdorfes. Auf dem Töpferwanderweg werden Wandernde mit weitläufigen Ausblicken auf das Tal der Buckau und die umliegende Fläminglandschaft belohnt.<br><br><a href=\"https://www.google.com/maps/place/Handwerkerhof+G%C3%B6rzke\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 6, name: "6. Hagelberg", x: 955, y: 725, description: "Der Hagelberg, ein echter 'Zweihunderter', lädt zum Eintrag ins Gipfelbuch ein - nicht ohne Grund wird der Landstrich rings um Klein Glien auch 'Kleines Mittelgebirge' genannt. Für den Aufstieg zum Gipfelkreuz wird man mit einem schönen Blick über die Fläminglandschaft belohnt. Unweit davon öffnet am Wochenende im historischen Gutshaus in Klein Glien ein Café für Ausflügler.<br><br><a href=\"https://www.google.com/maps/place/Hagelberg\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 7, name: "7. Bad Belzig mit Burg Eisenhardt", x: 1364, y: 605, description: "Auf der komplett erhaltenen Burg Eisenhardt lässt sich die 1000-jährige Geschichte der Stadt hautnah erkunden. Vom Butterturm bietet sich wohl der schönste Ausblick auf Stadt und Urstromtal. Unterhalb der Burg befinden sich die Burgwiesen, auf denen die bedrohten Großtrappen einen stillen Unterschlupf finden. In der SteinTherme sorgt jodhaltiges Thermalwasser für gesunde Entspannung.<br><br><a href=\"https://www.google.com/maps/place/Burg+Eisenhardt\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 8, name: "8. Aussichtspunkt Belziger Landschaftswiesen", x: 1575, y: 555, description: "Am Burgenwanderweg gelegen, bietet sich ein besonders eindrucksvoller Blick in das Niederungsgebiet der Belziger Landschaftswiesen. Dort befindet sich eines der wichtigsten Vogelschutzgebiete Brandenburgs. Wenn im Winterhalbjahr Großtrappen pflanzliche Nahrung suchen, bieten sich vom Rastplatz aus sehr gute Beobachtungsmöglichkeiten.<br><br><a href=\"https://www.google.com/maps/place/Aussichtsturm+Belziger+Landschaftswiesen\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 9, name: "9. Wiesenburg mit Schloss und Park", x: 765, y: 855, description: "Das Schloss zeigt sich heute im Erscheinungsbild des 19. Jahrhunderts. Vom Schlossturm hat man eine eindrucksvolle Aussicht auf Wiesenburg und seinen Park. Der als Landschaftspark gestaltete Schlosspark ist die bedeutendste Anlage seiner Art im Hohen Fläming und lädt zu ausgiebigen Spaziergängen ein. Bis zum Bahnhof erstreckt sich diese Anlage, durch die auch der Kunstwanderweg führt.<br><br><a href=\"https://www.google.com/maps/place/Schloss+Wiesenburg\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 10, name: "10. Naturparkzentrum Hoher Fläming", x: 1165, y: 1370, description: "Das Besucherinformationszentrum ist eine zentrale Anlaufstelle für alle Gäste. Hier erhält man die besten Tipps für Ausflüge in und durch den Hohen Fläming und kann Fahrräder ausleihen. Neben dem Fläming-Laden mit regionalen Produkten laden eine spannende Ausstellung und ein 'Garten der Sinne' ein. Direkt vor dem Naturparkzentrum hält der Burgenbus.<br><br><a href=\"https://www.google.com/maps/place/Naturparkzentrum+Hoher+Fl%C3%A4ming\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 11, name: "11. Raben mit Burg Rabenstein", x: 1120, y: 1333, description: "Bei Raben liegt die steilste der Flämingburgen, die Burg Rabenstein. Von der Burg führt ein Naturlehrpfad durch das Naturschutzgebiet Rabenstein hinunter ins Dorf und bis zum Naturparkzentrum. Die tagsüber offene Feldsteinkirche kann auch besucht werden. Der Gasthof Hemmerling bewirtet täglich außer montags seine Gäste.<br><br><a href=\"https://www.google.com/maps/place/Burg+Rabenstein\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 12, name: "12. Niemegk", x: 1620, y: 1140, description: "Das Städtchen Niemegk und das Renaissance-Rathaus prägen das Stadtbild. Vom Kirchturm bietet sich ein schöner Ausblick. Ein imposanter Wasserturm, der heute ein Brausemuseum und einen Regionalladen beherbergt, liegt am südlichen Rand der Stadt direkt am Burgenwanderweg. Ein Ausflug mit dem Rad lohnt sich von Niemegk aus auf die Feldsteinkirchenroute.<br><br><a href=\"https://www.google.com/maps/place/Rathaus+Niemegk\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 13, name: "13. Flämingbuchen", x: 650, y: 1174, description: "In dem großen Waldgebiet der Brandtsheide sind einige Inseln aus Buchen zu finden, wie in den Naturschutzgebieten 'Flämingbuchen' und 'Spring'. Auf den Buchenwanderwegen 70 oder 71 lassen sich diese landschaftlichen Besonderheiten des Naturparks erleben. Startpunkte sind die Bahnhöfe Medewitz und Wiesenburg.<br><br><a href=\"https://www.google.com/maps/place/Naturschutzgebiet+Fl%C3%A4mingbuchen\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 14, name: "14. Brautrummel mit Riesenstein", x: 1095, y: 995, description: "Wie eine Sage erzählt, verschwand ein junges Brautpaar nach einem Gewitterregen in der Rummel, einem Trockental. Heute kann man auf einer Rundwanderung zum Riesenstein die besondere Natur in der Rummel erleben, Familienfotos am Riesenstein machen, ein Picknick im Grünen genießen und anschließend eine Rast auf dem großen Feldstein machen.<br><br><a href=\"https://www.google.com/maps/place/Riesenstein\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 15, name: "15. Neuendorfer Rummel", x: 1400, y: 1340, description: "Die Rummeln, verzweigte, enge Trockentäler, entstanden durch das Schmelzwasser der Eiszeit. In späterer Zeit wurden sie stetig weiter vertieft. Wie grüne, bewaldete Finger strecken sie sich weit in die Agrarlandschaft hinein. Über den Burgenwanderweg oder den Rundwanderweg 40 kann man die üppig bewachsene und stellenweise urwaldartige Neuendorfer Rummel durchwandern.<br><br><a href=\"https://www.google.com/maps/place/Neuendorfer+Rummel\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" },
    { id: 16, name: "16. Garrey mit Aussichtsplattform", x: 1490, y: 1430, description: "Die Landschaft rings um Garrey bietet fantastische Ausblicke, weite Täler und steile Kanten. Deshalb 'krönt' eine Aussichtsplattform das alte Wasserwerk, das aufwendig restauriert wurde und in dem sich eine kleine Ausstellung befindet. Der Ausflug lässt sich sehr gut mit einer Wanderung in die Neuendorfer Rummel und einer Einkehr ins Café Lehmann in Garrey verbinden.<br><br><a href=\"https://www.google.com/maps/place/Aussichtsturm+am+alten+Wasserwerk\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"map-link\">View on Google Maps</a>" }
];

// Game State
const state = {
    balloon: {
        x: CONFIG.START_X,
        y: CONFIG.START_Y,
        vx: 0,
        vy: 0,
        angle: -90,
        speed: 0,
        totalDistance: 0,
    },
    input: {
        keys: new Set<string>(),
        joystick: { active: false, angle: 0, magnitude: 0, touchId: null as number | null }
    },
    pois: POI_DATA.map(p => ({ ...p, visited: false })),
    nearbyPOI: null as (typeof POI_DATA[0] & { visited: boolean }) | null,
    visitedCount: 0,
    gameActive: false,
    startTime: 0,
    elapsedTime: 0,
    stats: {
        maxSpeed: 0,
        landings: 0,
        totalDistance: 0
    },
    achievements: new Set<string>(),
    minimapCtx: null as CanvasRenderingContext2D | null,
    zoom: 1,
    targetZoom: 1,
};

// DOM Cache
const dom = {
    loadingScreen: document.getElementById('loading-screen') as HTMLElement,
    mapContainer: document.getElementById('map-container') as HTMLElement,
    mapViewport: document.getElementById('map-viewport') as HTMLElement,
    mapImage: document.getElementById('map-image') as HTMLImageElement,
    balloonContainer: document.getElementById('balloon-container') as HTMLElement,
    balloonVisuals: document.getElementById('balloon-visuals') as HTMLElement,
    speedDisplay: document.getElementById('speed-display') as HTMLElement,
    poiCount: document.getElementById('poi-count') as HTMLElement,
    timeDisplay: document.getElementById('time-display') as HTMLElement,
    headingDisplay: document.getElementById('heading-display') as HTMLElement,
    compassNeedle: document.getElementById('compass-needle') as HTMLElement,
    joystickContainer: document.getElementById('joystick-container') as HTMLElement,
    joystickHandle: document.getElementById('joystick-handle') as HTMLElement,
    landButton: document.getElementById('land-button') as HTMLButtonElement,
    menuButton: document.getElementById('menu-button') as HTMLButtonElement,
    menuContainer: document.getElementById('menu-container') as HTMLElement,
    menuClose: document.getElementById('menu-close') as HTMLButtonElement,
    poiList: document.getElementById('poi-list') as HTMLElement,
    statDistance: document.getElementById('stat-distance') as HTMLElement,
    statMaxSpeed: document.getElementById('stat-max-speed') as HTMLElement,
    statLandings: document.getElementById('stat-landings') as HTMLElement,
    statCompletion: document.getElementById('stat-completion') as HTMLElement,
    poiModal: document.getElementById('poi-modal') as HTMLElement,
    poiModalTitle: document.getElementById('poi-modal-title') as HTMLElement,
    poiModalDescription: document.getElementById('poi-modal-description') as HTMLElement,
    modalIcon: document.getElementById('modal-icon') as HTMLElement,
    modalVisitTime: document.getElementById('modal-visit-time') as HTMLElement,
    modalPOINumber: document.getElementById('modal-poi-number') as HTMLElement,
    continueButton: document.getElementById('continue-button') as HTMLButtonElement,
    nextPOIButton: document.getElementById('next-poi-button') as HTMLButtonElement,
    completionModal: document.getElementById('completion-modal') as HTMLElement,
    finalTime: document.getElementById('final-time') as HTMLElement,
    finalDistance: document.getElementById('final-distance') as HTMLElement,
    finalSpeed: document.getElementById('final-speed') as HTMLElement,
    restartButton: document.getElementById('restart-button') as HTMLButtonElement,
    exploreButton: document.getElementById('explore-button') as HTMLButtonElement,
    achievementToast: document.getElementById('achievement-toast') as HTMLElement,
    achievementText: document.getElementById('achievement-text') as HTMLElement,
    minimapCanvas: document.getElementById('minimap-canvas') as HTMLCanvasElement,
    zoomIn: document.getElementById('zoom-in') as HTMLButtonElement,
    zoomOut: document.getElementById('zoom-out') as HTMLButtonElement,
};

// Audio System
let audio = {
    initialized: false,
};

function initAudio() {
    if (audio.initialized) return;
    audio.initialized = true;
    console.log("Audio disabled for offline compatibility.");
}

// Helper: Strip numbering from name (e.g., "1. Name" -> "Name")
function getCleanName(name: string) {
    return name.replace(/^\d+\.\s*/, '');
}

async function loadImageAndStart() {
    try {
        if (!dom.mapImage) throw new Error('Map image element not found in the DOM.');
        
        const response = await fetch('images/map.jpg');

        if (!response.ok) {
            throw new Error(`Failed to fetch map image. Status: ${response.status} ${response.statusText}`);
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        dom.mapImage.onload = () => {
            URL.revokeObjectURL(imageUrl); 
            onMapLoaded();
        };
        dom.mapImage.onerror = (e) => {
            URL.revokeObjectURL(imageUrl); 
            console.error("Error event on image element after setting blob URL:", e);
            onMapError();
        };
        
        dom.mapImage.src = imageUrl;

    } catch (error) {
        console.error('Failed to load map resource:', error);
        onMapError();
    }
}

// Initialize
function init() {
    try {
        createPOIMarkers();
        populatePOIList();
        setupEventListeners();
        setupMinimap();
        
        loadImageAndStart();

    } catch (error) {
        console.error('Initialization error:', error);
        if (dom.loadingScreen) {
          dom.loadingScreen.innerHTML = `<p>Error initializing game: ${(error as Error).message}</p>`;
        }
    }
}

let mapLoaded = false;
function onMapLoaded() {
    if (mapLoaded) return;
    mapLoaded = true;

    dom.loadingScreen.style.opacity = '0';
    setTimeout(() => {
        dom.loadingScreen.style.display = 'none';
        state.gameActive = true;
        state.startTime = Date.now();
        centerCamera();
        requestAnimationFrame(gameLoop);
    }, 500);
}

function onMapError() {
    dom.loadingScreen.innerHTML = `
        <div class="loading-content" style="color: #e63946;">
            <div class="loading-balloon" style="animation: none;">⚠️</div>
            <div class="loading-text">Error: Map failed to load.</div>
            <p style="font-size: 14px; color: var(--text-secondary); max-width: 300px; text-align: center;">
                Please check the developer console for more details and ensure the file at 'images/map.jpg' is available.
            </p>
        </div>
    `;
}

function createPOIMarkers() {
    state.pois.forEach(poi => {
        const marker = document.createElement('div');
        marker.className = 'poi-marker';
        marker.id = `poi-${poi.id}`;
        marker.style.left = `${poi.x}px`;
        marker.style.top = `${poi.y}px`;
        marker.title = getCleanName(poi.name);
        
        const inner = document.createElement('div');
        inner.className = 'poi-marker-inner';
        marker.appendChild(inner);
        
        marker.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            if (poi.visited) {
                showPOIModal(poi);
            }
        });
        
        dom.mapViewport.appendChild(marker);
    });
}

function populatePOIList() {
    dom.poiList.innerHTML = '';
    state.pois.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.id = `poi-list-${poi.id}`;
        item.innerHTML = `
            <div class="poi-item-name">${getCleanName(poi.name)}</div>
            <div class="poi-item-status">${poi.visited ? '✓' : ''}</div>
        `;
        
        item.addEventListener('click', () => {
            centerCameraOn(poi.x, poi.y);
            closeMenu();
        });
        dom.poiList.appendChild(item);
    });
}

function setupMinimap() {
    const canvas = dom.minimapCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 200; 
    canvas.height = 150;
    state.minimapCtx = ctx;
}

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    dom.joystickContainer.addEventListener('touchstart', handleJoystickStart, { passive: false });
    document.addEventListener('touchmove', handleJoystickMove, { passive: false });
    document.addEventListener('touchend', handleJoystickEnd, { passive: false });
    dom.joystickContainer.addEventListener('mousedown', handleJoystickMouseStart);
    document.addEventListener('mousemove', handleJoystickMouseMove);
    document.addEventListener('mouseup', handleJoystickMouseEnd);
    dom.landButton.addEventListener('click', landAtPOI);
    dom.menuButton.addEventListener('click', toggleMenu);
    dom.menuClose.addEventListener('click', closeMenu);
    dom.continueButton.addEventListener('click', resumeFlight);
    dom.nextPOIButton.addEventListener('click', navigateToNextPOI);
    dom.restartButton.addEventListener('click', restartGame);
    dom.exploreButton.addEventListener('click', freeFlightMode);
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Zoom Controls
    dom.zoomIn.addEventListener('click', () => adjustZoom(CONFIG.ZOOM_STEP));
    dom.zoomOut.addEventListener('click', () => adjustZoom(-CONFIG.ZOOM_STEP));
    document.addEventListener('wheel', handleWheel, { passive: false });
}

function adjustZoom(delta: number) {
    state.targetZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, state.targetZoom + delta));
}

function handleWheel(e: WheelEvent) {
    if (e.ctrlKey) return; // Let browser handle pinch zoom
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * (CONFIG.ZOOM_STEP / 2);
    adjustZoom(delta);
}

// Input Handlers
function handleKeyDown(e: KeyboardEvent) {
    if (!state.gameActive) return;
    initAudio();
    state.input.keys.add(e.key.toLowerCase());
    if ((e.key === 'l' || e.key === 'L') && state.nearbyPOI) landAtPOI();
    if (e.key === 'm' || e.key === 'M') toggleMenu();
    if (e.key === 'Escape') closeMenu();
    if (e.key === '+' || e.key === '=') adjustZoom(CONFIG.ZOOM_STEP);
    if (e.key === '-' || e.key === '_') adjustZoom(-CONFIG.ZOOM_STEP);
}

function handleKeyUp(e: KeyboardEvent) {
    state.input.keys.delete(e.key.toLowerCase());
}

let joystickMouseActive = false;
function handleJoystickStart(e: TouchEvent) {
    if (!state.gameActive || state.input.joystick.active) return;
    initAudio();
    e.preventDefault();
    const touch = e.touches[0];
    state.input.joystick.active = true;
    state.input.joystick.touchId = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
}

function handleJoystickMove(e: TouchEvent) {
    if (!state.input.joystick.active) return;
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === state.input.joystick.touchId) {
            e.preventDefault();
            updateJoystick(touch.clientX, touch.clientY);
            break;
        }
    }
}

function handleJoystickEnd(e: TouchEvent) {
     for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === state.input.joystick.touchId) {
            e.preventDefault();
            resetJoystick();
            break;
        }
    }
}

function handleJoystickMouseStart(e: MouseEvent) {
    if (!state.gameActive) return;
    initAudio();
    e.preventDefault();
    joystickMouseActive = true;
    state.input.joystick.active = true;
    updateJoystick(e.clientX, e.clientY);
}

function handleJoystickMouseMove(e: MouseEvent) {
    if (!joystickMouseActive) return;
    updateJoystick(e.clientX, e.clientY);
}

function handleJoystickMouseEnd() {
    if (!joystickMouseActive) return;
    joystickMouseActive = false;
    resetJoystick();
}

function updateJoystick(clientX: number, clientY: number) {
    const rect = dom.joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > CONFIG.JOYSTICK_RADIUS) {
        dx = (dx / distance) * CONFIG.JOYSTICK_RADIUS;
        dy = (dy / distance) * CONFIG.JOYSTICK_RADIUS;
        distance = CONFIG.JOYSTICK_RADIUS;
    }
    state.input.joystick.angle = Math.atan2(dy, dx);
    state.input.joystick.magnitude = distance / CONFIG.JOYSTICK_RADIUS;
    dom.joystickHandle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function resetJoystick() {
    state.input.joystick.active = false;
    state.input.joystick.magnitude = 0;
    state.input.joystick.touchId = null;
    dom.joystickHandle.style.transform = 'translate(-50%, -50%)';
}

// Game Loop
let lastTime = 0;
function gameLoop(currentTime: number) {
    const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
    lastTime = currentTime;
    if (state.gameActive) {
        update(deltaTime);
        render();
    }
    requestAnimationFrame(gameLoop);
}

function update(dt: number) {
    // Smooth zoom transition
    if (Math.abs(state.targetZoom - state.zoom) > 0.001) {
        state.zoom += (state.targetZoom - state.zoom) * 0.1;
    }

    const balloon = state.balloon;
    if (state.startTime > 0) state.elapsedTime = Date.now() - state.startTime;

    let thrust = 0;
    let turning = 0;
    if (state.input.keys.has('arrowup') || state.input.keys.has('w')) thrust = 1;
    if (state.input.keys.has('arrowdown') || state.input.keys.has('s')) thrust = -0.5;
    if (state.input.keys.has('arrowleft') || state.input.keys.has('a')) turning = -1;
    if (state.input.keys.has('arrowright') || state.input.keys.has('d')) turning = 1;

    if (state.input.joystick.active && state.input.joystick.magnitude > 0.1) {
        thrust = state.input.joystick.magnitude;
        const targetAngle = state.input.joystick.angle * 180 / Math.PI;
        let angleDiff = targetAngle - balloon.angle;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        turning = Math.max(-1, Math.min(1, angleDiff / 45));
    }

    balloon.angle += turning * CONFIG.TURN_SPEED * dt;
    balloon.angle = (balloon.angle + 360) % 360;

    const angleRad = balloon.angle * Math.PI / 180;
    const accel = thrust * CONFIG.ACCELERATION;
    balloon.vx += Math.cos(angleRad) * accel * dt;
    balloon.vy += Math.sin(angleRad) * accel * dt;

    const drag = state.nearbyPOI ? 0.88 : CONFIG.DRAG;

    balloon.vx *= Math.pow(drag, dt);
    balloon.vy *= Math.pow(drag, dt);

    const oldX = balloon.x;
    const oldY = balloon.y;
    balloon.speed = Math.sqrt(balloon.vx * balloon.vx + balloon.vy * balloon.vy);
    if (balloon.speed > CONFIG.MAX_SPEED) {
        const scale = CONFIG.MAX_SPEED / balloon.speed;
        balloon.vx *= scale;
        balloon.vy *= scale;
        balloon.speed = CONFIG.MAX_SPEED;
    }

    balloon.x += balloon.vx * dt;
    balloon.y += balloon.vy * dt;
    balloon.x = Math.max(20, Math.min(CONFIG.MAP_WIDTH - 20, balloon.x));
    balloon.y = Math.max(20, Math.min(CONFIG.MAP_HEIGHT - 20, balloon.y));

    const distance = Math.sqrt(Math.pow(balloon.x - oldX, 2) + Math.pow(balloon.y - oldY, 2));
    if (distance > 0.01) {
        balloon.totalDistance += distance;
        state.stats.totalDistance = balloon.totalDistance / 100;
    }

    if (balloon.speed > state.stats.maxSpeed) state.stats.maxSpeed = balloon.speed;

    checkPOIProximity();
}

function checkPOIProximity() {
    let nearestPOI = null;
    let minDistance = Infinity;
    for (const poi of state.pois) {
        if (poi.visited) continue;
        const distance = Math.hypot(state.balloon.x - poi.x, state.balloon.y - poi.y);
        if (distance < CONFIG.LANDING_RADIUS && distance < minDistance) {
            nearestPOI = poi;
            minDistance = distance;
        }
    }

    if (nearestPOI !== state.nearbyPOI) {
        if (state.nearbyPOI) document.getElementById(`poi-${state.nearbyPOI.id}`)?.classList.remove('nearby');
        state.nearbyPOI = nearestPOI;
        if (nearestPOI) {
            document.getElementById(`poi-${nearestPOI.id}`)?.classList.add('nearby');
            dom.landButton.classList.add('visible');
        } else {
            dom.landButton.classList.remove('visible');
        }
    }
}

function render() {
    // Balloon position is relative to its container now, we move the map around it
    // But for visual consistency during zoom, the balloon stays centered on screen.
    // The container transform is used for landing animations.
    dom.balloonContainer.style.transform = `translate(calc(${state.balloon.x}px - 50%), calc(${state.balloon.y}px - 100%))`;
    
    const sunCycle = (state.elapsedTime % 120000) / 120000 * Math.PI * 2;
    const shadowDist = 40; 
    const shadowX = Math.cos(sunCycle) * shadowDist;
    const shadowY = Math.sin(sunCycle) * (shadowDist * 0.5);
    
    dom.balloonContainer.style.setProperty('--shadow-x', `${shadowX}px`);
    dom.balloonContainer.style.setProperty('--shadow-y', `${shadowY}px`);
    
    if (dom.balloonVisuals && state.gameActive) {
        const tilt = state.balloon.vx * 3;
        dom.balloonVisuals.style.transform = `rotate(${tilt}deg)`;
    }
    
    dom.speedDisplay.textContent = state.balloon.speed.toFixed(1);
    dom.poiCount.textContent = `${state.visitedCount}/16`;
    dom.timeDisplay.textContent = formatTime(state.elapsedTime);
    const heading = Math.round((state.balloon.angle + 360) % 360);
    dom.headingDisplay.textContent = `${heading}°`;
    dom.compassNeedle.style.transform = `translate(-50%, -50%) rotate(${state.balloon.angle}deg)`;

    dom.statDistance.textContent = state.stats.totalDistance.toFixed(1);
    dom.statMaxSpeed.textContent = state.stats.maxSpeed.toFixed(1);
    dom.statLandings.textContent = String(state.stats.landings);
    dom.statCompletion.textContent = `${Math.round((state.visitedCount / 16) * 100)}%`;

    centerCamera();
    renderMinimap();
}

function renderMinimap() {
    const ctx = state.minimapCtx;
    if (!ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const scale = w / CONFIG.MAP_WIDTH;
    
    ctx.clearRect(0, 0, w, h);
    
    // Background matching the vintage parchment theme
    ctx.fillStyle = '#f7f1e3'; 
    ctx.fillRect(0, 0, w, h);
    
    state.pois.forEach(poi => {
        // Only show visited POIs
        if (!poi.visited) return;

        // Ink-like green markers
        ctx.fillStyle = '#2e7d32'; 
        ctx.beginPath();
        ctx.arc(poi.x * scale, poi.y * scale, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.save();
    ctx.translate(state.balloon.x * scale, state.balloon.y * scale);
    ctx.rotate((state.balloon.angle + 90) * Math.PI / 180);
    // Balloon marker - Dark Ink
    ctx.fillStyle = '#2c1810';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-5, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function centerCamera() {
    const viewportWidth = dom.mapContainer.clientWidth;
    const viewportHeight = dom.mapContainer.clientHeight;
    const zoom = state.zoom;

    // Calculate target translation to center balloon
    // We move the viewport layer. 
    // transform: translate(x, y) scale(zoom)
    // Since transform-origin is 0 0 (top left), 
    // The visual position of balloon on screen is: (balloon.x * zoom) + translateX
    // We want this to equal viewportWidth / 2
    
    let targetX = (viewportWidth / 2) - (state.balloon.x * zoom);
    let targetY = (viewportHeight / 2) - (state.balloon.y * zoom);

    // Clamping Logic
    // Max X (left edge visible) is 0
    // Min X (right edge visible) is viewportWidth - (MAP_WIDTH * zoom)
    // If zoomed out so map is smaller than viewport, center it.
    
    const mapVisualWidth = CONFIG.MAP_WIDTH * zoom;
    const mapVisualHeight = CONFIG.MAP_HEIGHT * zoom;
    
    let minX = viewportWidth - mapVisualWidth;
    let minY = viewportHeight - mapVisualHeight;
    
    // If map is smaller than viewport, center it
    if (minX > 0) {
        // map fits inside, center it
        targetX = (viewportWidth - mapVisualWidth) / 2;
        minX = targetX; // prevent clamping override
    }
    
    if (minY > 0) {
        targetY = (viewportHeight - mapVisualHeight) / 2;
        minY = targetY;
    }

    // Apply clamping if map is larger than viewport
    if (mapVisualWidth >= viewportWidth) {
        targetX = Math.max(minX, Math.min(0, targetX));
    }
    if (mapVisualHeight >= viewportHeight) {
        targetY = Math.max(minY, Math.min(0, targetY));
    }

    dom.mapViewport.style.transform = `translate(${targetX}px, ${targetY}px) scale(${zoom})`;
}

function centerCameraOn(x: number, y: number) {
    state.balloon.x = x;
    state.balloon.y = y;
    state.balloon.vx = 0;
    state.balloon.vy = 0;
    centerCamera();
}

function landAtPOI() {
    if (!state.nearbyPOI || !state.gameActive) return;
    
    state.gameActive = false;
    state.balloon.vx = 0;
    state.balloon.vy = 0;

    dom.balloonContainer.classList.add('landing');
    // Explicitly clear transform to allow CSS animation to take precedence
    if (dom.balloonVisuals) {
        dom.balloonVisuals.style.transform = 'none'; 
    }

    setTimeout(() => {
        state.stats.landings++;
        const poi = state.nearbyPOI;
        if (poi && !poi.visited) {
            poi.visited = true;
            state.visitedCount++;
            document.getElementById(`poi-${poi.id}`)?.classList.add('visited');
            const listItem = document.getElementById(`poi-list-${poi.id}`);
            if(listItem) {
                listItem.classList.add('visited');
                (listItem.querySelector('.poi-item-status') as HTMLElement).textContent = '✓';
            }
            checkAchievements();
        }
        
        dom.landButton.classList.remove('visible');
        if (poi) showPOIModal(poi);
        if (state.visitedCount === 16) setTimeout(showCompletionModal, 1500);

    }, 2000);
}

function showPOIModal(poi: typeof POI_DATA[0] & { visited: boolean }) {
    dom.poiModalTitle.textContent = getCleanName(poi.name);
    dom.poiModalDescription.innerHTML = poi.description;
    dom.modalIcon.textContent = String(poi.id);
    dom.modalVisitTime.textContent = formatTime(state.elapsedTime);
    dom.modalPOINumber.textContent = `${state.visitedCount}/16`;
    dom.poiModal.classList.toggle('visited', poi.visited);
    dom.nextPOIButton.style.display = state.pois.some(p => !p.visited) ? 'block' : 'none';
    dom.poiModal.classList.add('active');
}

function resumeFlight() {
    dom.poiModal.classList.remove('active');
    
    dom.balloonContainer.classList.remove('landing');
    dom.balloonContainer.classList.add('takeoff');
    if (dom.balloonVisuals) {
        dom.balloonVisuals.style.transform = 'none'; 
    }
        
    setTimeout(() => {
        dom.balloonContainer.classList.remove('takeoff');
        state.gameActive = true;
    }, 1500);

    state.nearbyPOI = null;
    document.querySelectorAll('.poi-marker.nearby').forEach(m => m.classList.remove('nearby'));
}

function navigateToNextPOI() {
    const unvisited = state.pois.filter(p => !p.visited);
    if (unvisited.length === 0) return;
    let nearest = unvisited[0];
    let minDist = Infinity;
    unvisited.forEach(poi => {
        const dist = Math.hypot(poi.x - state.balloon.x, poi.y - state.balloon.y);
        if (dist < minDist) {
            minDist = dist;
            nearest = poi;
        }
    });
    centerCameraOn(nearest.x, nearest.y);
    resumeFlight();
}

function showCompletionModal() {
    dom.finalTime.textContent = formatTime(state.elapsedTime);
    dom.finalDistance.textContent = `${state.stats.totalDistance.toFixed(1)} km`;
    const avgSpeed = state.stats.totalDistance / (state.elapsedTime / 3600000) || 0;
    dom.finalSpeed.textContent = avgSpeed.toFixed(1);
    dom.completionModal.classList.add('active');
    showAchievement('🏆', 'Mission Complete!');
}

function checkAchievements() {
    if (state.visitedCount === 1 && !state.achievements.has('first')) {
        state.achievements.add('first');
        showAchievement('🎯', 'First Landing!');
    }
    if (state.visitedCount === 8 && !state.achievements.has('halfway')) {
        state.achievements.add('halfway');
        showAchievement('⭐', 'Halfway There!');
    }
    if (state.stats.maxSpeed >= 4.8 && !state.achievements.has('speed')) {
        state.achievements.add('speed');
        showAchievement('🚀', 'Speed Demon!');
    }
}

function showAchievement(icon: string, text: string) {
    dom.achievementText.textContent = text;
    const iconSpan = dom.achievementToast.querySelector('.achievement-icon');
    if (iconSpan) iconSpan.textContent = icon;
    dom.achievementToast.classList.add('show');
    setTimeout(() => dom.achievementToast.classList.remove('show'), 3000);
}

function toggleMenu() {
    dom.menuContainer.classList.toggle('open');
}

function closeMenu() {
    dom.menuContainer.classList.remove('open');
}

function restartGame() {
    state.balloon = { x: CONFIG.START_X, y: CONFIG.START_Y, vx: 0, vy: 0, angle: -90, speed: 0, totalDistance: 0 };
    state.visitedCount = 0;
    state.nearbyPOI = null;
    state.gameActive = true;
    state.startTime = Date.now();
    state.elapsedTime = 0;
    state.stats = { maxSpeed: 0, landings: 0, totalDistance: 0 };
    state.achievements.clear();
    
    dom.balloonContainer.classList.remove('landing', 'takeoff');
    if (dom.balloonVisuals) {
        dom.balloonVisuals.style.transform = '';
    }

    state.pois.forEach(poi => {
        poi.visited = false;
        document.getElementById(`poi-${poi.id}`)?.classList.remove('visited', 'nearby');
        const listItem = document.getElementById(`poi-list-${poi.id}`);
        if(listItem) {
            listItem.classList.remove('visited');
            (listItem.querySelector('.poi-item-status') as HTMLElement).textContent = '';
        }
    });
    
    dom.completionModal.classList.remove('active');
    dom.poiModal.classList.remove('active');
    dom.landButton.classList.remove('visible');
    resetJoystick();
    centerCamera();
}

function freeFlightMode() {
    dom.completionModal.classList.remove('active');
    state.gameActive = true;
    state.startTime = Date.now();
    showAchievement('🦅', 'Free Flight Mode!');
}

function formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

init();
