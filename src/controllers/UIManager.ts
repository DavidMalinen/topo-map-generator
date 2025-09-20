import StateManager from './StateManager';
import TopoApp from '../app/TopoApp';

import { AppState, EffectButton, UIElements } from '@/types';


class UIManager {
  private app: TopoApp;
  private state: AppState;
  private stateManager: StateManager;
  private elements: UIElements;

  constructor(app: TopoApp) {
    this.app = app;
    this.state = app.state;
    this.stateManager = app.stateManager;

    // Cache DOM elements
    this.elements = {
      maxHeightSlider: document.getElementById('max-height') as HTMLInputElement | null,
      heightValue: document.getElementById('height-value'),
      toggleViewBtn: document.getElementById('transform-btn'),
      resetBtn: document.getElementById('reset-btn'),
      coordinates: document.getElementById('coordinates'),
      valueLabel: document.getElementById('value-label'),
      status: document.getElementById('status')
    };
  }

  setupEventListeners(): void {
    this.setupHeightSlider();
    this.setupToggleViewButton();
    this.setupTerrainGenerators();
    this.setupResetButton();
    this.setupEffectButtons();
    this.setupInputController();
  }

  setupHeightSlider(): void {
    if (this.elements.maxHeightSlider) {
      this.elements.maxHeightSlider.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        this.stateManager.updateMaxHeight(parseInt(input.value));
        if (this.elements.heightValue) {
          this.elements.heightValue.textContent = this.state.maxHeight.toString();
        }
        this.app.drawTopo();
      });
    }
  }

  setupToggleViewButton(): void {
    if (this.elements.toggleViewBtn) {
      this.elements.toggleViewBtn.addEventListener('click', () => {
        this.stateManager.toggleIsometric();
        this.app.drawTopo();
      });
    }
  }

  setupTerrainGenerators(): void {
    const generatorButtons = [
      { id: 'random-btn', generatorType: 'random' },
      { id: 'center-btn', generatorType: 'centerPeak' },
      { id: 'city-btn', generatorType: 'cityGrid' },
      { id: 'crystal-btn', generatorType: 'crystal' },
      { id: 'wave-btn', generatorType: 'wave' }
    ];

    generatorButtons.forEach(btn => {
      const element = document.getElementById(btn.id);
      if (element) {
        element.addEventListener('click', () => {
          this.updateStatus(`Generating ${btn.generatorType} terrain...`);
          const generator = this.app.generatorFactory.createGenerator(
            btn.generatorType,
            this.app.rows,
            this.app.cols,
            this.app.state.maxHeight
          );
          const terrainData = generator.generate();
          this.app.elevationData.setData(terrainData);
          this.app.drawTopo();
          this.updateStatus(`${btn.generatorType} terrain generated`);
        });
      }
    });
  }

  setupResetButton(): void {
    if (this.elements.resetBtn) {
      this.elements.resetBtn.addEventListener('click', () => {
        this.app.elevationData.clear();
        this.app.drawTopo();
      });
    }
  }

  setupEffectButtons(): void {
    const effectButtons: EffectButton[] = [
      {
        id: 'scan-btn',
        effectName: 'scan',
        toggleMethod: 'toggleScanActive',
        requiresRedraw: false,
        onActivate: () => this.app.effects.toggleScanLine(true),
        onDeactivate: () => this.app.effects.toggleScanLine(false)
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
          switch (toggleMethod) {
            case 'toggleScanActive':
              this.stateManager.toggleScanActive();
              break;
            case 'setDitherActive':
              this.stateManager.setDitherActive(isActive);
              break;
            case 'setHoverActive':
              this.stateManager.setHoverActive(isActive);
              break;
            case 'setColorShiftActive':
              this.stateManager.setColorShiftActive(isActive);
              break;
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

  setupInputController(): void {
    this.app.inputController.setupListeners({
      onCoordsChange: (x: number, y: number) => {
        if (this.elements.coordinates) {
          this.elements.coordinates.textContent = `X: ${x} Y: ${y}`;
        }

        const elevation = this.app.elevationData.getElevation(x, y) || 0;
        if (this.elements.valueLabel) {
          this.elements.valueLabel.textContent = `ELEVATION: ${Math.floor(elevation)}`;
        }

        if (this.state.hoverActive) {
          this.app.drawTopo();
        }
      },
      onTerrainModify: (x: number, y: number, amount: number) => {
        this.app.modifyTerrainAt(x, y, amount);
        this.app.drawTopo();
      }
    });
  }

  updateStatus(message: string): void {
    if (this.elements.status) {
      this.elements.status.textContent = message;
    }
  }
}

export default UIManager;
