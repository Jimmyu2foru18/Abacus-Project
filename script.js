class AbacusCalculator {
    constructor() {
        this.rodCount = 13; // 10^0 to 10^12
        this.earthBeads = 5;
        this.heavenBeads = 2;
        this.history = [];
        this.currentStep = -1;
        this.initializeDOM();
        this.setupEventListeners();
    }

    initializeDOM() {
        this.rodContainer = document.getElementById('rodContainer');
        this.currentValueDisplay = document.getElementById('currentValue');
        this.createRods();
    }

    createRods() {
        for (let i = 0; i < this.rodCount; i++) {
            const rod = document.createElement('div');
            rod.className = 'rod';
            rod.dataset.value = Math.pow(10, i);

            // Create heaven beads
            for (let h = 0; h < this.heavenBeads; h++) {
                const bead = this.createBead('heaven', h);
                rod.appendChild(bead);
            }

            // Create earth beads
            for (let e = 0; e < this.earthBeads; e++) {
                const bead = this.createBead('earth', e);
                rod.appendChild(bead);
            }

            this.rodContainer.insertBefore(rod, this.rodContainer.firstChild);
        }
    }

    createBead(type, index) {
        const bead = document.createElement('div');
        bead.className = `bead ${type}-bead`;
        bead.dataset.type = type;
        bead.dataset.index = index;

        // Position beads
        const topOffset = type === 'heaven' ? 
            20 + (index * 25) : // Heaven beads at top
            150 + (index * 25); // Earth beads at bottom
        bead.style.top = `${topOffset}px`;

        return bead;
    }

    setupEventListeners() {
        // Bead interaction
        this.rodContainer.addEventListener('mousedown', this.handleBeadClick.bind(this));
        this.rodContainer.addEventListener('touchstart', this.handleBeadTouch.bind(this));

        // Control buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    handleBeadClick(event) {
        if (!event.target.classList.contains('bead')) return;

        const bead = event.target;
        const rod = bead.parentElement;
        const type = bead.dataset.type;
        const index = parseInt(bead.dataset.index);

        if (event.shiftKey) {
            this.resetRod(rod);
            return;
        }

        this.toggleBeads(rod, type, index);
        this.saveState();
        this.updateDisplay();
    }

    handleBeadTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const bead = document.elementFromPoint(touch.clientX, touch.clientY);
        if (bead && bead.classList.contains('bead')) {
            this.handleBeadClick({ target: bead });
        }
    }

    handleKeyboard(event) {
        const focusedBead = document.activeElement;
        if (!focusedBead || !focusedBead.classList.contains('bead')) return;

        switch(event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.handleBeadClick({ target: focusedBead });
                break;
            case 'Tab':
                // Handle tab navigation between beads
                break;
        }
    }

    toggleBeads(rod, type, index) {
        const beads = Array.from(rod.getElementsByClassName(`${type}-bead`));
        const clickedBead = beads[index];

        if (type === 'heaven') {
            // Toggle heaven beads independently
            clickedBead.classList.toggle('active');
        } else {
            // Toggle earth beads in sequence
            const shouldActivate = !clickedBead.classList.contains('active');
            beads.forEach((bead, i) => {
                if (shouldActivate && i <= index) {
                    bead.classList.add('active');
                } else if (!shouldActivate && i >= index) {
                    bead.classList.remove('active');
                }
            });
        }
    }

    calculateValue() {
        return Array.from(this.rodContainer.children).reduce((total, rod) => {
            const earthValue = rod.querySelectorAll('.earth-bead.active').length;
            const heavenValue = rod.querySelectorAll('.heaven-bead.active').length * 5;
            return total + ((earthValue + heavenValue) * parseInt(rod.dataset.value));
        }, 0);
    }

    updateDisplay() {
        const value = this.calculateValue();
        this.currentValueDisplay.textContent = value.toLocaleString();
    }

    saveState() {
        const state = Array.from(this.rodContainer.children).map(rod => {
            return {
                earthBeads: Array.from(rod.getElementsByClassName('earth-bead')).map(bead => bead.classList.contains('active')),
                heavenBeads: Array.from(rod.getElementsByClassName('heaven-bead')).map(bead => bead.classList.contains('active'))
            };
        });

        // Clear redo history when new action is performed
        this.history = this.history.slice(0, this.currentStep + 1);
        this.history.push(state);
        this.currentStep++;

        // Update button states
        this.updateControlButtons();
    }

    restoreState(state) {
        Array.from(this.rodContainer.children).forEach((rod, rodIndex) => {
            const rodState = state[rodIndex];
            
            Array.from(rod.getElementsByClassName('earth-bead')).forEach((bead, i) => {
                bead.classList.toggle('active', rodState.earthBeads[i]);
            });

            Array.from(rod.getElementsByClassName('heaven-bead')).forEach((bead, i) => {
                bead.classList.toggle('active', rodState.heavenBeads[i]);
            });
        });

        this.updateDisplay();
    }

    undo() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.restoreState(this.history[this.currentStep]);
            this.updateControlButtons();
        }
    }

    redo() {
        if (this.currentStep < this.history.length - 1) {
            this.currentStep++;
            this.restoreState(this.history[this.currentStep]);
            this.updateControlButtons();
        }
    }

    reset() {
        Array.from(this.rodContainer.getElementsByClassName('bead')).forEach(bead => {
            bead.classList.remove('active');
        });
        this.saveState();
        this.updateDisplay();
    }

    resetRod(rod) {
        Array.from(rod.getElementsByClassName('bead')).forEach(bead => {
            bead.classList.remove('active');
        });
        this.saveState();
        this.updateDisplay();
    }

    updateControlButtons() {
        document.getElementById('undoBtn').disabled = this.currentStep <= 0;
        document.getElementById('redoBtn').disabled = this.currentStep >= this.history.length - 1;
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.abacusCalculator = new AbacusCalculator();
});