const jwt = require('jsonwebtoken');

const isAdimin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer','');

    if(!token) {
        return res.status(401).json({ message: 'Äccess denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin only' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expried token' });
    }
};