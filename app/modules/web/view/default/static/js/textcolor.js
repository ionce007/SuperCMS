class WCAGContrast {
    static getRelativeLuminance(r, g, b) {
        const [rsRGB, gsRGB, bsRGB] = [r, g, b].map(v => v / 255);
        const [rLinear, gLinear, bLinear] = [rsRGB, gsRGB, bsRGB].map(v =>
            v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    static getContrastRatio(color1, color2) {
        const l1 = this.getRelativeLuminance(color1.r, color1.g, color1.b);
        const l2 = this.getRelativeLuminance(color2.r, color2.g, color2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    static parseColor(color) {
        if (typeof color === 'string') {
            if (color.startsWith('#')) return this.hexToRgb(color);
            if (color.startsWith('rgb')) return this.rgbStringToRgb(color);
        }
        if (typeof color === 'object' && color.r !== undefined) return color;
        throw new Error('Unsupported color format');
    }

    static hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return { r, g, b };
    }

    static rgbStringToRgb(rgbString) {
        const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return { r: 0, g: 0, b: 0 };
    }

    static checkContrast(foreground, background, level = 'AA', size = 'normal') {
        const fg = this.parseColor(foreground);
        const bg = this.parseColor(background);
        const ratio = this.getContrastRatio(fg, bg);

        const thresholds = {
            AA: { normal: 4.5, large: 3.0 },
            AAA: { normal: 7.0, large: 4.5 }
        };

        const requiredRatio = thresholds[level]?.[size] || thresholds.AA.normal;
        const passes = ratio >= requiredRatio;

        let achievedLevel = 'Fail';
        if (ratio >= thresholds.AAA.normal) achievedLevel = 'AAA';
        else if (ratio >= thresholds.AA.normal) achievedLevel = 'AA';
        else if (ratio >= thresholds.AA.large) achievedLevel = 'AA Large';

        return {
            ratio: Math.round(ratio * 100) / 100,
            requiredRatio,
            passes,
            level: achievedLevel,
            foreground: fg,
            background: bg
        };
    }

    static rgbToHex(color) {
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    }
}

// ================= 智能前景色选择器 =================
class AutoTextColor {
    static getAccessibleTextColor(backgroundColor, options = {}) {
        const defaults = {
            minContrast: 4.5,
            preferDark: false,
            preferLight: false,
            customPalette: null,
            targetLevel: 'AA',
            textSize: 'normal',
            fallbackToClosest: true
        };

        const config = { ...defaults, ...options };
        const bgColor = WCAGContrast.parseColor(backgroundColor);

        if (config.customPalette && config.customPalette.length > 0) {
            const result = this._findBestFromPalette(bgColor, config);
            if (result) return result.color;
        }

        if (config.preferDark) return this._getOptimalDarkColor(bgColor, config);
        if (config.preferLight) return this._getOptimalLightColor(bgColor, config);

        return this._getOptimalContrastColor(bgColor, config);
    }

    static _findBestFromPalette(bgColor, config) {
        const candidates = config.customPalette.map(color =>
            WCAGContrast.parseColor(color)
        );

        let bestColor = null;
        let bestRatio = 0;
        const requiredRatio = config.textSize === 'large' && config.targetLevel === 'AA'
            ? 3.0
            : config.targetLevel === 'AAA'
                ? (config.textSize === 'large' ? 4.5 : 7.0)
                : 4.5;

        candidates.forEach(candidate => {
            const ratio = WCAGContrast.getContrastRatio(candidate, bgColor);
            if (ratio >= requiredRatio && ratio > bestRatio) {
                bestRatio = ratio;
                bestColor = candidate;
            }
        });

        if (bestColor) return { color: WCAGContrast.rgbToHex(bestColor), ratio: bestRatio };
        return null;
    }

    static _getOptimalDarkColor(bgColor, config) {
        const darkColors = ['#000000', '#111111', '#222222', '#333333', '#444444'];

        for (const color of darkColors) {
            const result = WCAGContrast.checkContrast(
                color, WCAGContrast.rgbToHex(bgColor), config.targetLevel, config.textSize
            );
            if (result.passes) return color;
        }

        return config.fallbackToClosest ? '#000000' : '#000000';
    }

    static _getOptimalLightColor(bgColor, config) {
        const lightColors = ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#F5F5F5', '#FAFAFA'];

        for (const color of lightColors) {
            const result = WCAGContrast.checkContrast(
                color, WCAGContrast.rgbToHex(bgColor), config.targetLevel, config.textSize
            );
            if (result.passes) return color;
        }

        return config.fallbackToClosest ? '#FFFFFF' : '#FFFFFF';
    }

    static _getOptimalContrastColor(bgColor, config) {
        const bgLuminance = WCAGContrast.getRelativeLuminance(bgColor.r, bgColor.g, bgColor.b);
        const threshold = 0.179;

        if (bgLuminance > threshold) {
            return this._getOptimalDarkColor(bgColor, config);
        } else {
            return this._getOptimalLightColor(bgColor, config);
        }
    }

    static generateAccessiblePalette(backgroundColor) {
        const bgColor = WCAGContrast.parseColor(backgroundColor);
        const primaryText = this.getAccessibleTextColor(backgroundColor);
        const largeText = this.getAccessibleTextColor(backgroundColor, {
            textSize: 'large'
        });

        return {
            background: WCAGContrast.rgbToHex(bgColor),
            text: {
                primary: primaryText,
                secondary: this._adjustOpacity(primaryText, 0.7),
                disabled: this._adjustOpacity(primaryText, 0.4),
                large: largeText,
                inverted: this._getInvertedColor(primaryText)
            }
        };
    }

    static _adjustOpacity(color, opacity) {
        const rgb = WCAGContrast.parseColor(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    static _getInvertedColor(color) {
        const rgb = WCAGContrast.parseColor(color);
        return WCAGContrast.rgbToHex({
            r: 255 - rgb.r,
            g: 255 - rgb.g,
            b: 255 - rgb.b
        });
    }
}