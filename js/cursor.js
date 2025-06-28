// Maingrace247 - Custom Cursor Logic

(function() {
    // Only run on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        // Create custom cursor element
        const cursor = document.createElement('div');
        cursor.id = 'maingrace-cursor';
        cursor.style.position = 'fixed';
        cursor.style.zIndex = '9999';
        cursor.style.pointerEvents = 'none';
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.background = "url('images/cursor/leaf-cursor.webp') center/contain no-repeat";
        cursor.style.transition = 'transform 0.18s cubic-bezier(0.4,0,0.2,1), opacity 0.2s';
        cursor.style.opacity = '0';
        cursor.style.mixBlendMode = 'multiply';
        document.body.appendChild(cursor);

        let cursorVisible = false;
        let isHand = false;

        // Show/hide cursor on mouse move/leave
        document.addEventListener('mousemove', e => {
            cursor.style.left = (e.clientX - 20) + 'px';
            cursor.style.top = (e.clientY - 20) + 'px';
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
        });
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorVisible = false;
        });

        // Interactive elements
        const interactiveSelectors = [
            'a', 'button', '.btn-primary', '.btn-secondary', '.nav-link', '.mobile-nav-link',
            '.form-input', 'select', 'textarea', '[role="button"]', '[tabindex]'
        ];
        document.body.addEventListener('mouseover', e => {
            if (matchesInteractive(e.target, interactiveSelectors)) {
                setHandCursor();
            }
        });
        document.body.addEventListener('mouseout', e => {
            if (matchesInteractive(e.target, interactiveSelectors)) {
                setLeafCursor();
            }
        });
        document.body.addEventListener('mousedown', e => {
            if (matchesInteractive(e.target, interactiveSelectors)) {
                cursor.style.transform = 'scale(0.92)';
            }
        });
        document.body.addEventListener('mouseup', e => {
            if (matchesInteractive(e.target, interactiveSelectors)) {
                cursor.style.transform = 'scale(1.08)';
                setTimeout(() => cursor.style.transform = 'scale(1)', 120);
            }
        });

        function matchesInteractive(target, selectors) {
            return selectors.some(sel => target.matches && target.matches(sel));
        }
        function setHandCursor() {
            if (!isHand) {
                cursor.style.background = "url('images/cursor/hand-cursor.webp') center/contain no-repeat";
                cursor.style.filter = 'brightness(1.1)';
                cursor.style.transform = 'scale(1.12)';
                isHand = true;
            }
        }
        function setLeafCursor() {
            if (isHand) {
                cursor.style.background = "url('images/cursor/leaf-cursor.webp') center/contain no-repeat";
                cursor.style.filter = 'none';
                cursor.style.transform = 'scale(1)';
                isHand = false;
            }
        }

        // Accessibility: Hide on touch devices
        window.addEventListener('touchstart', () => {
            cursor.style.display = 'none';
        }, { once: true });
    }
})(); 