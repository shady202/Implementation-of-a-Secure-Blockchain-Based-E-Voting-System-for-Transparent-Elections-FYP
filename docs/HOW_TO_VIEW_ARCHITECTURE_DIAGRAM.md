# How to View the System Architecture Diagram

## 📊 Diagram Files

1. **`system-architecture-diagram.drawio`** - Complete Draw.io visual diagram (recommended)
2. **`SYSTEM_ARCHITECTURE_DIAGRAM.md`** - Mermaid text-based diagram with detailed explanations

---

## 🎨 Viewing the Draw.io Diagram

### Option 1: Online (Easiest)
1. Go to [https://app.diagrams.net/](https://app.diagrams.net/) (formerly draw.io)
2. Click **"Open Existing Diagram"**
3. Select **"Device"** tab
4. Upload `docs/system-architecture-diagram.drawio`
5. The diagram will open with all 8 layers visible

### Option 2: VS Code Extension
1. Install **"Draw.io Integration"** extension in VS Code
2. Open `docs/system-architecture-diagram.drawio`
3. The diagram will render directly in VS Code
4. You can edit and export from here

### Option 3: Desktop App
1. Download Draw.io desktop app from [https://github.com/jgraph/drawio-desktop/releases](https://github.com/jgraph/drawio-desktop/releases)
2. Open `docs/system-architecture-diagram.drawio`
3. Full editing and export capabilities

---

## 📤 Exporting the Diagram

### From Draw.io:
1. **File → Export as → PNG** (for presentations)
2. **File → Export as → PDF** (for documents)
3. **File → Export as → SVG** (for scalable graphics)
4. **File → Export as → JPEG** (for web use)

### Recommended Export Settings:
- **PNG**: Resolution 300 DPI, Transparent background
- **PDF**: A4 or Letter size, Fit to page
- **SVG**: For web embedding

---

## 🏗️ Diagram Structure

The diagram shows **8 distinct layers**:

1. **CLIENT LAYER** (Blue) - Web browsers, mobile devices, MetaMask
2. **PRESENTATION LAYER** (Purple) - React frontend, pages, UI components
3. **BLOCKCHAIN INTEGRATION** (Orange) - ethers.js, contract interfaces
4. **APPLICATION LAYER** (Green) - Express backend, API routes, services
5. **BLOCKCHAIN LAYER** (Pink) - Smart contract, functions, storage
6. **DATA LAYER** (Teal) - PostgreSQL database, tables
7. **EXTERNAL SERVICES** (Yellow) - Ethereum network, email, RPC
8. **SECURITY LAYER** (Red) - Authentication, validation, monitoring

---

## 🔍 Diagram Features

- **Color-coded layers** for easy identification
- **Component details** with technology versions
- **Connection arrows** showing data flows
- **Icons** for visual clarity
- **Professional styling** suitable for FYP documentation

---

## 📝 Using in Your FYP Report

1. **Export as PNG/PDF** at high resolution (300 DPI)
2. **Add caption**: "Figure X: System Architecture Diagram"
3. **Reference in text**: "As shown in Figure X, the system consists of 8 layers..."
4. **Include legend** if needed (colors are self-explanatory)

---

## ✏️ Editing the Diagram

### To Add Components:
1. Open in Draw.io
2. Select the appropriate layer
3. Add new shapes/components
4. Connect with arrows
5. Save

### To Change Colors:
1. Select component
2. Right-click → Format
3. Change fill/stroke colors
4. Maintain consistency with layer colors

---

## 💡 Tips

- **Zoom**: Use mouse wheel or zoom controls to see details
- **Pan**: Click and drag to move around
- **Search**: Use Ctrl+F to find specific components
- **Layers**: Use layer panel to show/hide specific layers
- **Grid**: Enable grid for alignment (View → Grid)

---

## 🆘 Troubleshooting

**Diagram won't open?**
- Ensure file extension is `.drawio`
- Try opening in online version first
- Check file isn't corrupted

**Components overlapping?**
- Use "Arrange" menu to auto-layout
- Manually drag components to adjust
- Use alignment tools

**Export quality poor?**
- Increase DPI/resolution in export settings
- Use PNG or PDF instead of JPEG
- Check zoom level before exporting

---

**Need help?** Refer to the detailed explanations in `SYSTEM_ARCHITECTURE_DIAGRAM.md`

