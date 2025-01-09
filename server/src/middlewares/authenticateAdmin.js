import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';  // Ensure this is the same secret key used to sign the token

const authenticateAdmin = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the same SECRET_KEY
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if the user has the role "ADMIN"
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to access this resource' });
    }

    // Attach the decoded user data to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default authenticateAdmin;


