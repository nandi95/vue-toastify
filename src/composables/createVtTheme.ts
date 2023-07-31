function darken(color: string, amount: number): string {
    const hex = color.slice(1);
    const rgb = parseInt(hex, 16);
    const r = rgb >> 16 & 0xff;
    const g = rgb >> 8 & 0xff;
    const b = rgb & 0xff;

    const darkened = [
        Math.max(0, r - amount),
        Math.max(0, g - amount),
        Math.max(0, b - amount)
    ];

    return `#${darkened.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function lighten(color: string, amount: number): string {
    const hex = color.slice(1);
    const rgb = parseInt(hex, 16);
    const r = rgb >> 16 & 0xff;
    const g = rgb >> 8 & 0xff;
    const b = rgb & 0xff;

    const lightened = [
        Math.min(255, r + amount),
        Math.min(255, g + amount),
        Math.min(255, b + amount)
    ];

    return `#${lightened.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
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
        style.type = 'text/css';
        style.id = styleSheetId.toString();
        document.head.appendChild(style);
    }

    getCssRules(name, colour)
        .forEach(rule => style!.sheet!.insertRule(
            rule.replaceAll('  ', '').replaceAll('\n', ' ')
        ));
}
