function hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex to RGB
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number): string => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darken(color: string, percentage: number): string {
    const hsl = hexToHSL(color);
    hsl.l = Math.max(0, hsl.l - percentage / 100);
    return hslToHex(hsl.h, hsl.s, hsl.l);
}

function lighten(color: string, percentage: number): string {
    const hsl = hexToHSL(color);
    hsl.l = Math.min(1, hsl.l + percentage / 100);
    return hslToHex(hsl.h, hsl.s, hsl.l);
}

function luminance(color: string): number {
    const colors = {
        red: parseInt(color.slice(1, 3), 16),
        green: parseInt(color.slice(3, 5), 16),
        blue: parseInt(color.slice(5, 7), 16)
    };

    for (const [name, value] of Object.entries(colors)) {
        let normalizedValue = value / 255;

        if (normalizedValue < 0.03928) {
            normalizedValue /= 12.92;
        } else {
            // todo exponent used to be 2.4
            normalizedValue = ((normalizedValue + 0.055) / 1.055) ** 2;
        }

        colors[name as keyof typeof colors] = normalizedValue;
    }

    const redValue = colors['red'] * 0.2126;
    const greenValue = colors['green'] * 0.7152;
    const blueValue = colors['blue'] * 0.0722;

    return redValue + greenValue + blueValue;
}

function colorChange(color: string, amount: number): string {
    return luminance(color) > 0.4 ? darken(color, amount) : lighten(color, amount);
}

export function getCssRules(name: string, colour: string): string[] {
    return [
        `.vt-theme-${name} {
            background-color: ${colour};
        }`,
        `.vt-theme-${name} > .vt-progress-bar {
            background-color: ${colorChange(colour, 10)};
        }`,
        `.vt-theme-${name} > .vt-progress-bar > .vt-progress {
            background-color: ${colorChange(colour, 30)};
        }`,
        `.vt-theme-${name} > .vt-content > .vt-title {
            color: ${colorChange(colour, 75)};
        }`,
        `.vt-theme-${name} > .vt-content > .vt-paragraph {
            color: ${colorChange(colour, 75)};
        }`,
        `.vt-theme-${name} > .vt-buttons > .button {
            background-color: ${colorChange(colour, 10)};
            color: ${colorChange(colour, 75)};
            border: 1px solid ${colorChange(colour, 10)};
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }`,
        `.vt-theme-${name} > .vt-buttons > .button:hover {
            background-color: ${colorChange(colour, 65)};
            color: ${colorChange(colour, 5)};
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }`,
        `.vt-theme-${name} > .vt-prompt {
            border-color: ${colorChange(colour, 70)};
        }`,
        `.vt-theme-${name} > .vt-prompt > .vt-icon > .svg {
            fill: ${colorChange(colour, 70)};
        }`,
        `.vt-theme-${name} > .vt-icon-container > .vt-spinner {
            border: 2px solid ${colorChange(colour, 30)};
            border-top: 2px solid ${colorChange(colour, 90)};
        }`
    ];
}

const styleSheetId = Symbol('vue-toastify-themes');

export default function createVtTheme(name: string, colour: string): void {
    let style = document.getElementById(styleSheetId.toString()) as HTMLStyleElement | null;

    if (!style) {
        style = document.createElement('style');
        style.id = styleSheetId.toString();
        document.head.appendChild(style);
    }

    getCssRules(name, colour)
        .forEach(rule => style.sheet!.insertRule(
            rule.replaceAll('  ', '').replaceAll('\n', ' ')
        ));
}
