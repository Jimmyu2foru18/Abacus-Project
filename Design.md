# Abacus Project Design Document

## 1. Introduction
### 1.1 Purpose of the System
The Abacus Project creates an interactive web-based abacus calculator that simulates the traditional Chinese suanpan with 13 rods. It serves as both an educational tool for understanding place values and a practical calculator for performing arithmetic operations.

### 1.2 Design Goals
- Create an intuitive, visually appealing representation of a physical abacus
- Implement smooth, realistic bead movements with proper physics
- Ensure accessibility across devices and for users with disabilities
- Provide educational value through clear visualization of numerical concepts
- Balance historical accuracy with modern usability enhancements

## 2. System Architecture
### 2.1 Subsystem Decomposition
The Abacus Project is decomposed into the following subsystems:

1. **Presentation Layer**
   - Abacus Visualization Component
   - User Interface Controls
   - Theme Manager
   - Animation Controller

2. **Logic Layer**
   - Bead Interaction Controller
   - Calculation Engine
   - History Manager
   - Tutorial System

3. **Data Layer**
   - State Persistence Manager
   - Configuration Storage
   - User Progress Tracker

### 2.2 Hardware/Software Mapping
The application is designed as a client-side web application with the following technology stack:

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Rendering**: Canvas API for complex animations, SVG for static elements
- **Storage**: LocalStorage for settings, IndexedDB for larger state data
- **Deployment**: GitHub Pages for hosting
- **CI/CD**: GitHub Actions for automated deployment

### 2.3 Persistent Data Management
The application manages the following persistent data:

1. **User Preferences**
   - Selected theme
   - Sound settings
   - Accessibility options
   - Last used configuration

2. **Calculation States**
   - Current abacus state
   - History stack (limited to 100 states)
   - Saved configurations (up to 10)

3. **Educational Progress**
   - Completed tutorials
   - Practice exercise results
   - Achievement badges

Data is stored using browser storage APIs with the following strategy:
- LocalStorage for small, frequently accessed data
- IndexedDB for larger datasets and history stacks
- Optional cloud sync for registered users (future enhancement)

## 3. Subsystem Services
### 3.1 User Interface Subsystem
The UI subsystem provides the following services:

1. **Abacus Visualization**
   - Render abacus frame and beads
   - Handle animations and transitions
   - Provide visual feedback for interactions

2. **Control Panel**
   - Display current value
   - Provide reset and undo/redo buttons
   - Offer settings and help access

3. **Theme Manager**
   - Apply visual themes using CSS custom properties
   - Toggle between light/dark modes
   - Support custom color schemes

4. **Accessibility Services**
   - Keyboard navigation
   - Screen reader compatibility
   - High contrast mode
   - Customizable animation speeds

### 3.2 Logic Subsystem
The logic subsystem provides these core services:

1. **Bead Controller**
   - Track bead positions and states
   - Validate movement requests
   - Apply movement constraints
   - Trigger appropriate animations

2. **Calculation Engine**
   - Convert bead positions to numeric values
   - Handle place value calculations
   - Provide formatted output
   - Detect and prevent invalid states

3. **History Manager**
   - Maintain undo/redo stack
   - Capture state snapshots
   - Restore previous states
   - Manage stack size limits

4. **Tutorial System**
   - Guide users through basic operations
   - Provide interactive examples
   - Track completion progress
   - Offer contextual help

## 4. Low-level Design
### 4.1 Object Design
The application uses the following key classes and interfaces:

1. **Abacus**
   ```typescript
   interface Abacus {
     rods: Rod[];
     frame: Frame;
     divider: Divider;
     currentValue: number;
     settings: AbacusSettings;
     
     reset(): void;
     getValue(): number;
     setState(state: AbacusState): void;
     exportState(): AbacusState;
     updateDisplay(): void;
   }
   ```

2. **Rod**
   ```typescript
   interface Rod {
     id: string;
     placeValue: number;
     earthBeads: Bead[];
     heavenBeads: Bead[];
     value: number;
     position: Position;
     
     calculateValue(): number;
     reset(): void;
     moveBeadsTo(position: number): void;
     isValidMove(bead: Bead, position: Position): boolean;
   }
   ```

3. **Bead**
   ```typescript
   interface Bead {
     id: string;
     position: Position;
     active: boolean;
     rod: Rod;
     type: 'earth' | 'heaven';
     
     toggle(): void;
     moveTo(position: Position): void;
     isMovable(direction: 'up' | 'down'): boolean;
     getNeighbors(): Bead[];
   }
   ```

4. **AbacusController**
   ```typescript
   class AbacusController {
     private abacus: Abacus;
     private history: HistoryManager;
     private dragState: DragState | null;
     private animationFrame: number;
     
     constructor(config: AbacusConfig);
     initEvents(): void;
     handleDrag(event: DragEvent): void;
     updateDisplay(): void;
     handleKeyboard(event: KeyboardEvent): void;
     cleanup(): void;
   }
   ```

5. **HistoryManager**
   ```typescript
   class HistoryManager {
     private states: AbacusState[];
     private currentIndex: number;
     private maxStates: number;
     
     constructor(maxStates: number);
     saveState(state: AbacusState): void;
     undo(): AbacusState | null;
     redo(): AbacusState | null;
     canUndo(): boolean;
     canRedo(): boolean;
     clear(): void;
   }
   ```

### 4.2 Algorithm Design
Key algorithms and their implementations:

1. **Bead Movement Validation**
   ```typescript
   function isValidMove(bead: Bead, newPosition: Position): boolean {
     // Check physical constraints
     if (!isWithinRodBounds(newPosition)) return false;
     
     // Check neighboring beads
     const neighbors = bead.getNeighbors();
     if (bead.type === 'earth') {
       return !hasBlockingEarthBeads(neighbors, newPosition);
     } else {
       return !hasBlockingHeavenBeads(neighbors, newPosition);
     }
   }
   ```