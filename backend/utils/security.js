const customMongoSanitize = (req, res, next) => {
    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                sanitizeObject(obj[key]);
            } else if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/\$|\.(?=\w)/g, '');
            }
        }
    };

    ['body', 'params', 'headers', 'query'].forEach(key => {
        if (req[key]) {
            sanitizeObject(req[key]);
        }
    });

    next();
};

const customXss = (req, res, next) => {
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                sanitizeObject(obj[key]);
            } else if (typeof obj[key] === 'string') {
                obj[key] = escapeHtml(obj[key]);
            }
        }
    };

    ['body', 'params', 'query'].forEach(key => {
        if (req[key]) {
            sanitizeObject(req[key]);
        }
    });

    next();
};

const customHpp = (req, res, next) => {
    const whitelist = ['', ''];
    for (let [key, value] of Object.entries(req.query)) {
        if (!whitelist.includes(key) && Array.isArray(value)) {
            req.query[key] = value[value.length - 1];
        }
    }
    next();
};

module.exports = {
    customMongoSanitize,
    customXss,
    customHpp
};