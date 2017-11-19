export const getRandomStr = string_length => {
    // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
    let text = '';
    const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        POSSIBLE_SCOPE = POSSIBLE.length;

    for (let i = 0; i < string_length; i += 1) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
    }

    return text;
};

export const getRandomColor = () => {
    let h = Math.floor(Math.random() * 360),
        s = Math.floor(Math.random() * 100) + '%',
        l = Math.floor(Math.random() * 60) + 20 + '%';
    return `hsl(${h},${s},${l})`;
};