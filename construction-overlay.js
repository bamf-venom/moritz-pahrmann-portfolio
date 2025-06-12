// =========================
// CONSTRUCTION OVERLAY MODULE
// =========================
// WICHTIG: Wenn diese Datei existiert, wird das Construction Overlay angezeigt
// ENTFERNEN: Lösche diese Datei um das Overlay zu entfernen

document.addEventListener('DOMContentLoaded', function() {
    // Find the Projects Section
    const projectsSection = document.getElementById('projectsSection');
    
    if (projectsSection) {
        // Make Projects Section relative positioned for overlay
        projectsSection.style.position = 'relative';
        
        // Construction Overlay HTML
        const constructionOverlayHTML = `
            <div class="construction-overlay" id="constructionOverlay">
                <div class="construction-barrier-top"></div>
                <div class="construction-content">
                    <div class="construction-icon">🚧</div>
                    <h3 class="construction-title">COMING SOON</h3>
                    <p class="construction-text">New projects are currently in development.<br>Check back soon for amazing VFX work!</p>
                    <div class="construction-tools">
                        <span class="tool">⚒️</span>
                        <span class="tool">🔧</span>
                        <span class="tool">⚡</span>
                    </div>
                </div>
                <div class="construction-barrier-bottom"></div>
            </div>
        `;
        
        // Add the Construction Overlay to Projects Section
        projectsSection.insertAdjacentHTML('beforeend', constructionOverlayHTML);
        
        console.log('✅ Construction overlay loaded - delete construction-overlay.js to remove');
    }
});

// Optional: Functions to hide/show overlay (usable in browser console)
function hideConstructionOverlay() {
    const overlay = document.getElementById('constructionOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        console.log('Construction overlay hidden');
    }
}

function showConstructionOverlay() {
    const overlay = document.getElementById('constructionOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        console.log('Construction overlay shown');
    }
}

function removeConstructionOverlay() {
    const overlay = document.getElementById('constructionOverlay');
    if (overlay) {
        overlay.remove();
        console.log('Construction overlay removed completely');
    }
}