import ElevationData from '../models/ElevationData.js';

class UIManager {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.stateManager = app.stateManager;
        this.canvas = app.canvas;
        this.elevationData = app.elevationData;

        // Cache DOM elements
        this.elements = {
            maxHeightSlider: document.getElementById('max-height'),
            heightValue: document.getElementById('height-value'),
            toggleViewBtn: document.getElementById('transform-btn'),
            resetBtn: document.getElementById('reset-btn'),
            coordinates: document.getElementById('coordinates'),
            valueLabel: document.getElementById('value-label'),
            status: document.getElementById('status')
        };
    }

    setupEventListeners() {
        this.setupHeightSlider();
        this.setupToggleViewButton();
        this.setupGeneratorButtons();
        this.setupResetButton();
        this.setupEffectButtons();
        this.setupInputController();
    }

    setupHeightSlider() {
        if (this.elements.maxHeightSlider) {
            this.elements.maxHeightSlider.addEventListener('input', (e) => {
                this.stateManager.updateMaxHeight(parseInt(e.target.value));
                this.elements.heightValue.textContent = this.state.maxHeight;
                this.app.drawTopo();
            });
        }
    }

    setupToggleViewButton() {
        if (this.elements.toggleViewBtn) {
            this.elements.toggleViewBtn.addEventListener('click', () => {
                this.stateManager.toggleIsometric();
                this.app.drawTopo();
            });
        }
    }

    setupGeneratorButtons() {
        const generatorButtons = [
            { id: 'random-btn', Generator: this.app.RandomTerrainGenerator },
            { id: 'center-btn', Generator: this.app.CenterPeakGenerator },
            { id: 'city-btn', Generator: this.app.CityGridGenerator },
            { id: 'crystal-btn', Generator: this.app.CrystalFormationGenerator },
            { id: 'wave-btn', Generator: this.app.WavePatternGenerator }
        ];
        
        generatorButtons.forEach(({ id, Generator }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    const generator = new Generator(
                        this.app.rows, 
                        this.app.cols, 
                        this.state.maxHeight
                    );
                    generator.generate();
                    
                    // Update elevation data
                    this.app.elevationData.setFromArray(generator.getElevationData());
                    this.app.drawTopo();
                });
            }
        });
    }

    setupResetButton() {
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                this.app.elevationData.clear();
                this.app.drawTopo();
            });
        }
    }

    setupEffectButtons() {
        const effectButtons = [
            { 
                id: 'scan-btn', 
                effectName: 'scan',
                toggleMethod: 'toggleScanActive',
                requiresRedraw: false,
                onActivate: () => this.app.scanLineEffect.start(),
                onDeactivate: () => this.app.scanLineEffect.stop()
            },
            { 
                id: 'dither-btn', 
                effectName: 'dither',
                toggleMethod: 'setDitherActive',
                requiresRedraw: true
            },
            { 
                id: 'hover-btn', 
                effectName: 'hover',
                toggleMethod: 'setHoverActive', 
                requiresRedraw: true
            },
            { 
                id: 'color-shift-btn', 
                effectName: 'colorShift',
                toggleMethod: 'setColorShiftActive',
                requiresRedraw: true
            }
        ];

        effectButtons.forEach(({ id, effectName, toggleMethod, requiresRedraw, onActivate, onDeactivate }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    const isActive = this.stateManager.toggleButton(effectName);
                    
                    // Call the appropriate state manager method
                    if (this.stateManager[toggleMethod]) {
                        this.stateManager[toggleMethod](isActive);
                    }
                    
                    // Update button appearance
                    if (isActive) {
                        button.classList.add('active');
                        if (onActivate) onActivate();
                    } else {
                        button.classList.remove('active');
                        if (onDeactivate) onDeactivate();
                    }
                    
                    // Redraw if needed
                    if (requiresRedraw) {
                        this.app.drawTopo();
                    }
                });
            }
        });
    }

    setupInputController() {
        this.app.inputController.setupListeners({
            onCoordsChange: (x, y) => {
                this.elements.coordinates.textContent = `X: ${x} Y: ${y}`;
                
                const elevation = this.app.elevationData.getElevation(x, y) || 0;
                this.elements.valueLabel.textContent = `ELEVATION: ${Math.floor(elevation)}`;
                
                if (this.state.hoverActive) {
                    this.app.drawTopo();
                }
            },
            onTerrainModify: (x, y, amount) => {
                this.app.modifyTerrainAt(x, y, amount);
                this.app.drawTopo();
            }
        });
    }

    updateStatus(message) {
        if (this.elements.status) {
            this.elements.status.textContent = message;
        }
    }
}

export default UIManager;