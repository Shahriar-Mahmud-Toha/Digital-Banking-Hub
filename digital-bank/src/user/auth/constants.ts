
const crypto = require('crypto');



 const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Usage
export const secret = generateSecret();
