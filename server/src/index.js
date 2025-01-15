import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from 'cors';
import multer from "multer"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { time } from 'console';
import Joi from "joi";
import { Server } from 'socket.io';
import http from "http"



// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import authenticateAdmin from "./middlewares/authenticateAdmin.js";

const prisma = new PrismaClient();
const app = express();



// Initialize
// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers)
  },
});


// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});








app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));





// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your client's URL
  credentials: true, // If you're using cookies or authentication headers
}));
app.use(bodyParser.json());

const SECRET_KEY = "your-secret-key";


//-------- Auth ---------------
//-----------------------------


// Register a new user
app.post("/register", async (req, res) => {
  const { firstName,lastName,cin,matricule,password,role, image ,address,phone,formateurId ,gender} = req.body;
  // Validate role
  if (!["ADMIN", "FORMATEUR","OPERATEUR"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { firstName:firstName,lastName:lastName,cin:cin,matricule:matricule,password: hashedPassword, role,image ,gender},
    });
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", details: error.message });
  }
});

//-------- Login a user -----------
//---------------------------------
app.post('/login', async (req, res) => {
  const { cin, password } = req.body;
  if (!cin || !password) {
    return res.status(400).json({ error: 'Please provide both username and password' });
  }
  try {
    // Query user based on the `userName` field
    const user = await prisma.user.findUnique({
      where: { cin: cin }
    });


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '4h' });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

//-------- User Logout ------------
//---------------------------------
const blacklist = new Set();
app.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    blacklist.add(token); // Add the token to the blacklist
    return res.json({ message: 'Logged out successfully' });
  }
  res.status(400).json({ error: 'Token not provided' });
});

// Middleware to authenticate the token and check the user's role
const authenticateAdmin = (req, res, next) => {
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


//------ For layout to check if user Is ADMIN ------------
//--------------------------------------------------------
app.get('/admin/verify', authenticateAdmin, (req, res) => {
  if (req.user.role === 'ADMIN') {
    return res.status(200).json({ isAdmin: true });
  } else {
    return res.status(403).json({ isAdmin: false });
  }
});







// Middleware to authenticate the token and check the user's role
const authenticateFormateur = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the same SECRET_KEY
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if the user has the role "ADMIN"
    if (decoded.role !== 'FORMATEUR') {
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

app.get('/formateur/verify', authenticateFormateur, (req, res) => {

  if (req.user.role === 'FORMATEUR') {
    return res.status(200).json({ isFormateur: true });
  } else {
    return res.status(403).json({ isFormateur: false });
  }
});




const authenticateOPERATEUR = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the same SECRET_KEY
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if the user has the role "ADMIN"
    if (decoded.role !== 'OPERATEUR') {
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

app.get('/operateur/verify', authenticateOPERATEUR, (req, res) => {

  if (req.user.role === 'OPERATEUR') {
    return res.status(200).json({ isOperateur: true });
  } else {
    return res.status(403).json({ isOperateur: false });
  }
});




// Admin update profile
// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Ensure the folder exists and is writable
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// const upload = multer({ storage });
const BASE_URL = 'http://localhost:3000';

app.put('/admin/profile/update', authenticateAdmin, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule } = req.body;
  
  function deleteOldImage(imagePath) {
    const fullPath = path.resolve(imagePath); // Make sure we get an absolute path
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${fullPath}`, err);
        } else {
          console.log(`Deleted old image: ${fullPath}`);
        }
      });
    } else {
      console.warn(`Image not found for deletion: ${fullPath}`);
    }
  }

  if (!firstName || !lastName || !cin || !matricule) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  try {
    // Fetch the existing user to get the current image path
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageURL;

    // Check if a new image was uploaded
    if (req.file) {
      // Build the full URL for the uploaded image
      imageURL = `${BASE_URL}/uploads/${req.file.filename}`;

      // Delete the previous image if it exists
      if (existingUser.image) {
        // Extract the local file path from the image URL
        const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
        deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Adjust the path for the 'uploads' directory
      }
    }

    const updateData = {
      firstName,
      lastName,
      cin,
      matricule,
      ...(imageURL && { image: imageURL }), // Only include the image URL if an image was uploaded
    };

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        image: updateData.image || updatedUser.image, // Ensure the correct image URL is returned
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
});
















app.put('/operateur/profile/update', authenticateOPERATEUR, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule ,address,phone } = req.body;
  
  function deleteOldImage(imagePath) {
    const fullPath = path.resolve(imagePath); // Make sure we get an absolute path
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${fullPath}`, err);
        } else {
          console.log(`Deleted old image: ${fullPath}`);
        }
      });
    } else {
      console.warn(`Image not found for deletion: ${fullPath}`);
    }
  }

  if (!firstName || !lastName || !cin || !matricule || !address || !phone) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  try {
    // Fetch the existing user to get the current image path
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageURL;

    // Check if a new image was uploaded
    if (req.file) {
      // Build the full URL for the uploaded image
      imageURL = `${BASE_URL}/uploads/${req.file.filename}`;

      // Delete the previous image if it exists
      if (existingUser.image) {
        // Extract the local file path from the image URL
        const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
        deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Adjust the path for the 'uploads' directory
      }
    }

    const updateData = {
      firstName,
      lastName,
      cin,
      matricule,
      address,
      phone,
      ...(imageURL && { image: imageURL }), // Only include the image URL if an image was uploaded
    };

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        image: updateData.image || updatedUser.image, // Ensure the correct image URL is returned
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
});


app.put('/formateur/profile/update', authenticateFormateur, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule ,address=null,phone=null } = req.body;
  
  function deleteOldImage(imagePath) {
    const fullPath = path.resolve(imagePath); // Make sure we get an absolute path
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${fullPath}`, err);
        } else {
          console.log(`Deleted old image: ${fullPath}`);
        }
      });
    } else {
      console.warn(`Image not found for deletion: ${fullPath}`);
    }
  }

  if (!firstName || !lastName || !cin || !matricule || !address || !phone) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  try {
    // Fetch the existing user to get the current image path
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageURL;

    // Check if a new image was uploaded
    if (req.file) {
      // Build the full URL for the uploaded image
      imageURL = `${BASE_URL}/uploads/${req.file.filename}`;

      // Delete the previous image if it exists
      if (existingUser.image) {
        // Extract the local file path from the image URL
        const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
        deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Adjust the path for the 'uploads' directory
      }
    }

    const updateData = {
      firstName,
      lastName,
      cin,
      matricule,
      address,
      phone,
      ...(imageURL && { image: imageURL }), // Only include the image URL if an image was uploaded
    };

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        image: updateData.image || updatedUser.image, // Ensure the correct image URL is returned
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
});
























app.put('/admin/password/update', authenticateAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required' });
  }

  try {
    // Fetch the existing user to verify the current password
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id }, // req.user.id should be set by your authentication middleware
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the stored password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({
      message: 'Password updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});






app.put('/operateur/password/update', authenticateOPERATEUR, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required' });
  }

  try {
    // Fetch the existing user to verify the current password
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id }, // req.user.id should be set by your authentication middleware
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the stored password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({
      message: 'Password updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});


app.put('/formateur/password/update', authenticateFormateur, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required' });
  }

  try {
    // Fetch the existing user to verify the current password
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id }, // req.user.id should be set by your authentication middleware
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the stored password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({
      message: 'Password updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});




















// admin get all users
app.get('/admin/users', authenticateAdmin, async (req, res) => {
  try {
    // Fetch users with their formateur's data
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
      include: {
        formateur: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Map users to include formateur name
    const usersWithFormateur = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      cin: user.cin,
      matricule: user.matricule,
      role: user.role,
      image: user.image,
      address: user.address,
      phone: user.phone,
      formateur: user.formateur
        ? `${user.formateur.firstName} ${user.formateur.lastName}`
        : null, // Include formateur's full name if available
    }));

    // Send the users data to the frontend
    return res.status(200).json(usersWithFormateur);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
});



app.get('/formateur/operateurs', authenticateFormateur, async (req, res) => {
  const formateurId = req.user.id;

  try {
    // Fetch users associated with the formateur
    const users = await prisma.user.findMany({
      where: {
        formateurId: formateurId // Ensure we get users that belong to the formateur
      },
      include: {
        formateur: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        memberOfGroups: {
          select: {
            name: true,  // Fetch only the group name
          },
        },
      },
    });

    // Process each user and map them with formateur and group info
    const usersWithFormateurAndGroups = users.map(user => {
      // Since user can only belong to one group, we directly access the first group
      const groupName = user.memberOfGroups ? user.memberOfGroups.name : null;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        cin: user.cin,
        matricule: user.matricule,
        role: user.role,
        image: user.image,
        address: user.address,
        groups: groupName, // One group per user, so we use the group name
        phone: user.phone,
        formateur: user.formateur
          ? `${user.formateur.firstName} ${user.formateur.lastName}` // Full name of formateur
          : null,
      };
    });

    // Send the user data to the frontend
    return res.status(200).json(usersWithFormateurAndGroups);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
});






// Admin Create Users

app.post('/admin/users/create', authenticateAdmin, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule, password, role ,gender} = req.body;
  const image = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Image URL

  if (!firstName || !lastName || !cin || !matricule || !password || !role || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        cin,
        matricule,
        password: hashedPassword,
        role,
        image, // Store the image URL
        address:req.body.address,
        phone:req.body.phone,
        gender:req.body.gender,
        formateurId:null,
      }
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        cin: newUser.cin,
        matricule: newUser.matricule,
        role: newUser.role,
        gender:newUser.gender,
        image: newUser.image,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
});



app.post(
  '/formateur/operateurs/create',
  authenticateFormateur,
  multer({ storage }).single('image'),
  async (req, res) => {
    const { firstName, lastName, cin, matricule, password ,gender} = req.body;
    const image = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Image URL

    // Retrieve the formateurId from the authenticated user
    const formateurId = req.user?.id; // Assuming req.user contains the authenticated user info
    const role = "OPERATEUR"; // Default role is OPERATEUR

    // Validate required fields
    if (!firstName || !lastName || !cin || !matricule || !password || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!formateurId) {
      return res.status(403).json({ message: 'Formateur ID is required but could not be retrieved' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the new user to the database
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          cin,
          matricule,
          password: hashedPassword,
          role, // Default role is OPERATEUR
          image, // Store the image URL
          groupeId:req.body.groupeId || null,
          address: req.body.address || null,
          phone: req.body.phone || null,
          gender:gender,
          formateurId: formateurId, // Use formateurId from token
        },
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          cin: newUser.cin,
          matricule: newUser.matricule,
          role: newUser.role,
          image: newUser.image,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }
);




app.get('/admin/profile', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        cin: true,
        matricule: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});





app.get('/formateur/profile', authenticateFormateur, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        cin: true,
        matricule: true,
        image: true,
        role:true,
        address: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});



app.get('/operateur/profile', authenticateOPERATEUR, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        cin: true,
        matricule: true,
        image: true,
        role:true,
        address: true,
        phone: true,
        formateur: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});







// ------ Admin Delete User ------
// -------------------------------
app.delete('/admin/user/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Formater deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete formater' });
  }
});


// ------ Formateur Delete Operateur ------
// -------------------------------
app.delete('/formateur/operateur/delete/:id', authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Formater deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete formater' });
  }
});





// const upload = multer({ dest: 'uploads/' });
app.post('/formateur/quizzes', authenticateFormateur,multer({ storage }).any(), async (req, res) => {
  try {
    const { title, description, code, category, difficulty, testPoints, openTime, closeTime, timeLimit, questions } =
      req.body;

    const creatorId =  req.user?.id; // Replace with authenticated user's ID
    const parsedQuestions = JSON.parse(questions);

    // Start a transaction
    const test = await prisma.test.create({
      data: {
        title,
        description,
        code,
        category,
        difficulty,
        testPoints: parseFloat(testPoints),
        // quizOpenTime.setHours(quizOpenTime.getHours() - 1);
        open_time: openTime ? new Date(new Date(openTime).getTime() + 60 * 60 * 1000) : null,
        close_time: closeTime ? new Date(new Date(closeTime).getTime() + 60 * 60 * 1000) : null,
        timeLimit: timeLimit ? parseInt(timeLimit, 10) : null,
        creatorId,
        questions: {
          create: parsedQuestions.map((question, questionIndex) => {
            let imageUrl = null;

            // Handle file uploads for image questions
            const imageFile = req.files.find((file) => file.fieldname === `questionImage_${questionIndex}`);
            if (imageFile) {
              imageUrl = `/uploads/${imageFile.filename}`;
            }

            return {
              text: question.text,
              point: parseFloat(question.point),
              type: question.type,
              imageUrl,
              answers: {
                create: question.answers.map((answer, answerIndex) => ({
                  text: answer.text,
                  isCorrect: answer.isCorrect,
                  answerNumber: question.type === 'IMAGE' ? answerIndex : null,
                })),
              },
            };
          }),
        },
      },
    });

    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});







app.put('/formateur/quizzes/:id', 
  authenticateFormateur,
  multer({ storage }).any(),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { 
        title, 
        description, 
        code, 
        category, 
        difficulty, 
        testPoints, 
        status,
        openTime, 
        closeTime, 
        timeLimit, 
        questions 
      } = req.body;

      const creatorId = req.user?.id;
      const parsedQuestions = JSON.parse(questions);

      // Delete existing questions and answers
      await prisma.question.deleteMany({
        where: { testId: id }
      });

      // Update test and create new questions
      const updatedTest = await prisma.test.update({
        where: { id },
        data: {
          title,
          description,
          code,
          category,
          difficulty,
          status,
          testPoints: parseInt(testPoints),
          open_time: openTime ? new Date(new Date(openTime).getTime() + 60 * 60 * 1000) : null,
          close_time: closeTime ? new Date(new Date(closeTime).getTime() + 60 * 60 * 1000) : null,
          timeLimit: timeLimit ? parseInt(timeLimit, 10) : null,
          creatorId,
          questions: {
            create: parsedQuestions.map((question, questionIndex) => {
              let imageUrl = null;
              const imageFile = req.files?.find(file => 
                file.fieldname === `questionImage_${questionIndex}`
              );
              
              if (imageFile) {
                imageUrl = `http://localhost:3000/uploads/${imageFile.filename}`;
              }

              return {
                text: question.text,
                point: parseFloat(question.point),
                type: question.type,
                imageUrl,
                answers: {
                  create: question.answers.map((answer, answerIndex) => ({
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                    answerNumber: question.type === 'IMAGE' ? answerIndex : null,
                  })),
                },
              };
            }),
          },
        },
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      });

      res.status(200).json({ 
        message: 'Test updated successfully', 
        test: updatedTest 
      });
    } catch (error) {
      console.error('Update test error:', error);
      res.status(500).json({ error: 'Failed to update test' });
    }
  }
);






// Route to fetch all quizzes
app.get('/quizzes',authenticateAdmin,async (req, res) => {
  try {
    const quizzes = await prisma.test.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        createdAt: true,
        category: true,
        difficulty: true,
        testPoints:true,
        status:true,
        open_time:true,
        close_time:true,
        timeLimit:true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Format the response to include full name
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      code: quiz.code,
      createdAt: quiz.createdAt,
      category: quiz.category,
      difficulty: quiz.difficulty,
      testPoints:parseInt(quiz.testPoints),
      status:quiz.status,
      open_time:quiz.open_time,
      close_time:quiz.close_time,
      timeLimit:quiz.timeLimit,
      creatorName: `${quiz.creator.firstName} ${quiz.creator.lastName}`,
    }));

    res.json(formattedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
});


app.get('/formateur/quizzes', authenticateFormateur, async (req, res) => {
  try {
    // Retrieve the formateur's ID from the token (assumes it's attached by `authenticateFormateur`)
    const formateurId = req.user?.id;

    if (!formateurId) {
      return res.status(403).json({ message: 'Formateur ID is required but could not be retrieved.' });
    }

    // Fetch quizzes created by the formateur
    const quizzes = await prisma.test.findMany({
      where: {
        creatorId: formateurId, // Filter by the formateur's ID
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        createdAt: true,
        category: true,
        difficulty: true,
        testPoints: true,
        status:true,
        open_time:true,
        close_time:true,
        timeLimit:true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Format the response to include the creator's full name
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      code: quiz.code,
      createdAt: quiz.createdAt,
      category: quiz.category,
      difficulty: quiz.difficulty,
      testPoints: parseInt(quiz.testPoints),
      status:quiz.status,
      open_time:quiz.open_time,
      close_time:quiz.close_time,
      timeLimit:quiz.timeLimit,
      creatorName: `${quiz.creator.firstName} ${quiz.creator.lastName}`,
    }));

    res.json(formattedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
});





app.get('/formateurs',async(req,res)=>{
  try {
    const formateurs = await prisma.user.findMany({
      where: { role: "FORMATEUR" },
    });
    res.json(formateurs);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }

})





app.get('/groups/:id/operateurs', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the group with its members
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: true, // Include all members of the group
      },
    });

    // Check if the group exists
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    console.log(group);  // Check if group data is returned correctly
    // Filter members who are Operateurs
    const operateurs = group.members.filter(member => member.role == 'OPERATEUR');

    return res.status(200).json({ operateurs });
  } catch (error) {
    console.error('Error fetching operateurs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// delete user from the group:
app.put('/group/operateur/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the group with its members
    const user = await prisma.user.update({
      where: { id },
      data: {
        groupeId: null, // Include all members of the group
      },
    });


    return res.status(200).json({message:"Delete user from group!" ,user });
  } catch (error) {
    console.error('Error fetching operateurs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});













app.post("/quiz/access", async (req, res) => {
  const { quizTitle, quizCode, cin } = req.body;

  try {
    // Check if the quiz exists by title and code
    const quiz = await prisma.test.findFirst({
      where: {
        title: quizTitle,
        code: quizCode,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Check if the user exists by matricule
    const user = await prisma.user.findUnique({
      where: {
        cin: cin,

      },
    });

    if (!user) {
      return res.status(404).json({ message: "User with the given matricule not found." });
    }

    // Check if the current date is within the quiz's open and close time
    const currentDateTime = new Date(); // Get current date and time

    // Subtract one hour from open_time and close_time
    const quizOpenTime = new Date(quiz.open_time);
    quizOpenTime.setHours(quizOpenTime.getHours() - 1);

    const quizCloseTime = new Date(quiz.close_time);
    quizCloseTime.setHours(quizCloseTime.getHours() - 1);

    console.log("Current DateTime:", currentDateTime);
    console.log("Adjusted Quiz Open Time:", quizOpenTime);
    console.log("Adjusted Quiz Close Time:", quizCloseTime);

    if (quiz.status == "CLOSE") {
      return res.status(400).json({ message: "Quiz is Closed At the Moments ." });
    }


    if (quiz.open_time && quizOpenTime > currentDateTime) {
      return res.status(400).json({ message: "Quiz is not yet open." });
    }

    if (quiz.close_time && quizCloseTime < currentDateTime) {
      return res.status(400).json({ message: "Quiz has already closed." });
    }

    // If all checks pass, grant access
    return res.status(200).json({
      message: "Access granted",
      quizId: quiz.id, // The quiz ID
      userId: user.id, // The user ID
    });

  } catch (error) {
    console.error("Error accessing quiz:", error);
    return res.status(500).json({ message: "An error occurred. Please try again later." });
  }
});



app.get("/quiz/:quizId", async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await prisma.test.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true, // Include answers for each question
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "An error occurred while fetching the quiz" });
  }
});








// POST endpoint to save a quiz attempt

app.post("/quiz-attempts", authenticateOPERATEUR, async (req, res) => {
  const { quizId, answers } = req.body;

  const userId = req.user?.id;

  try {
    // Validate input
    if (!userId || !quizId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Check if the quiz exists
    const quiz = await prisma.test.findUnique({
      where: { id: quizId },
      include: { questions: { include: { answers: true } } },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already attempted the quiz
    const existingAttempt = await prisma.testAttempt.findUnique({
      where: {
        userId_testId: {
          userId: userId,
          testId: quizId,
        },
      },
    });

    if (existingAttempt) {
      return res.status(400).json({ error: "User has already attempted this quiz" });
    }

    // Calculate the score and correct answers
    let score = 0;
    let correctAnswers = 0;

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      // Extract correct answers for the question
      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => String(a.id)) // Ensure IDs are strings (UUID)
        .sort(); // Sort the correct answer IDs for comparison

      // Compare the selected answers with the correct answers
      const selectedAnswerIds = answer.selectedAnswerIds
        .map(id => String(id)) // Ensure IDs are strings (UUID)
        .sort(); // Sort the selected answer IDs for comparison

      // For single select and multi-select questions, check if the selected answers match the correct ones
      let isCorrect = false;

      if (question.type === "ONE_SELECTE" || question.type === "IMAGE_ONE_SELECTE") {
        // For single selection questions, only one answer is selected
        isCorrect = selectedAnswerIds.length === 1 && selectedAnswerIds[0] === correctAnswerIds[0];
      } else if (question.type === "MULTI_SELECTE" || question.type === "IMAGE_MULTI_SELECTE") {
        // For multiple selection questions, compare all selected answers against correct answers
        isCorrect = JSON.stringify(selectedAnswerIds) === JSON.stringify(correctAnswerIds);
      }

      // If the answer is correct, update the score
      if (isCorrect) {
        score += question.point;
        correctAnswers += 1;
      }
    }

    // Save the quiz attempt in the database
    const quizAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId: quizId,
        score: parseFloat(score.toFixed(2)), // Ensure the score is in a float format with 2 decimals
        correctAnswers: parseInt(correctAnswers),
        totalQuestions: quiz.questions.length,
      },
    });



    const operateur = await prisma.user.findUnique({
      where:{id:userId}
    });

    const test   = await prisma.test.findUnique({
      where:{id:quizId}
    })


    io.emit('testAttemptSaved', {
      operateurName:`${operateur.lastName} ${operateur.firstName}`,
      testName:test.title,
      score,
      testPoints:test.testPoints,
      date: quizAttempt.createdAt
    });

    return res.status(201).json({ success: true, quizAttempt });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




app.put("/test-attempt/:id", authenticateFormateur, async (req, res) => {
  const { id } = req.params;
  const { new_score } = req.body;

  // Validate the new_score input
  if (typeof new_score !== 'number' || new_score < 0 || new_score > 100) {
    return res.status(400).json({ message: 'Invalid score. It should be a number between 0 and 100.' });
  }

  try {
    // Fetch the test attempt to ensure it exists before updating
    const existingTestAttempt = await prisma.testAttempt.findUnique({
      where: { id },
    });

    if (!existingTestAttempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }

    // Update the test attempt score
    const updatedTestAttempt = await prisma.testAttempt.update({
      where: { id },
      data: {
        score: parseFloat(new_score)
      },
    });

    // Return the updated test attempt
    return res.status(200).json({ updatedTestAttempt });
  } catch (error) {
    console.error('Error updating test attempt:', error);
    return res.status(500).json({ message: 'Error updating test attempt' });
  }
});


app.delete("/test-attempt/:id", authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the test attempt to ensure it exists before deleting
    const existingTestAttempt = await prisma.testAttempt.findUnique({
      where: { id },
    });

    if (!existingTestAttempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    // Delete the test attempt
    await prisma.testAttempt.delete({
      where: { id },
    });

    // Return success response
    return res.status(200).json({ message: "Test attempt deleted successfully" });
  } catch (error) {
    console.error("Error deleting test attempt:", error);
    return res.status(500).json({ message: "Error deleting test attempt" });
  }
});












app.post("/quiz-check", authenticateOPERATEUR, async (req, res) => {
  const { quizId } = req.body;
  const userId = req.user?.id;

  try {
    if (!userId || !quizId) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Get quiz details
    const quiz = await prisma.test.findUnique({
      where: { id: quizId },
      include: { testAttempts: true },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Check if the test is open or closed
    const currentDate = new Date();
    const openDate = new Date(quiz.openDate);
    const closeDate = new Date(quiz.closeDate);

    if (currentDate < openDate || currentDate > closeDate) {
      return res.status(400).json({ error: "Test is not available at this moment" });
    }

    // Check if the user has already attempted the test
    const existingAttempt = quiz.testAttempts.some(
      (attempt) => attempt.userId === userId
    );

    if (existingAttempt) {
      return res.status(400).json({ error: "User has already attempted this quiz" });
    }

    return res.status(200).json({ success: true, message: "User can attempt the quiz" });
  } catch (error) {
    console.error("Error checking quiz availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});











app.get("/admin/statistics",authenticateAdmin,async(req,res)=>{
  const formateurs = await prisma.user.findMany({
    where: { role: "FORMATEUR" },
  });

  const operateurs = await prisma.user.findMany({
    where: { role: "OPERATEUR" },
  });

  const quizzes = await prisma.test.findMany({
  
  });

  const quizAttempt = await prisma.testAttempt.findMany({
  
  });


  return res.status(201).json({ formaters: formateurs.length,operateurs:operateurs.length ,quizzes:quizzes.length,quizAttempt:quizAttempt.length});
})



app.get("/formateur/statistics",authenticateFormateur,async(req,res)=>{

  const formateurId = req.user?.id; // Ensure `req.user` is properly populated

  if (!formateurId) {
    return res.status(401).json({ message: "Unauthorized: Formateur ID not found" });
  }
  
  try {
    // Fetch operateurs linked to the formateur
    const operateurs = await prisma.user.findMany({
      where: {
        role: "OPERATEUR", // Role is 'OPERATEUR'
        formateurId: formateurId, // Matches the current Formateur's ID
      },
    });
  
    const tests = await prisma.test.findMany({
      where:{
        creatorId:formateurId
      }
    });
  
    const groupes = await prisma.group.findMany({
      where:{
        leaderId:formateurId
      } 
    });
  
  
    return res.status(201).json({ operateurs:operateurs.length ,tests:tests.length,groupes:groupes.length});
  } catch (error) {
    console.error("Error fetching operateurs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
})














app.post("/groups", authenticateFormateur, async (req, res) => {
  const { name, description } = req.body;
  const leaderId = req.user?.id; // Assuming user is authenticated and their ID is in the request

  try {
    // Validate the required fields
    if (!name || !leaderId) {
      return res.status(400).json({ error: "Name and leaderId are required." });
    }

    // Check if the leader exists
    const leader = await prisma.user.findUnique({
      where: { id: leaderId },
    });

    if (!leader) {
      return res.status(404).json({ error: "Leader not found." });
    }


    // Create the group
    const newGroup = await prisma.group.create({
      data: {
        name,
        leaderId:leaderId,
        // leader: { connect: { id: leaderId } }, // Connect the leader
        description, // Connect members (optional)
      },
    });

    return res.status(201).json({ success: true, group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});





app.get('/groups', authenticateFormateur, async (req, res) => {
  const formateurId = req.user.id; // Extract the authenticated FORMATEUR's ID

  try {
    // Fetch groups led by the FORMATEUR along with their members
    const groups = await prisma.group.findMany({
      where: {
        leaderId: formateurId,
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cin: true,
            matricule: true,
            role: true,
            image: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    // Map groups to include members' data
    const groupsWithMembers = groups.map((group) => ({
      id: group.id,
      name: group.name,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      members: group.members.map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        cin: member.cin,
        matricule: member.matricule,
        role: member.role,
        image: member.image,
        address: member.address,
        phone: member.phone,
      })),
    }));

    // Send the groups data to the frontend
    return res.status(200).json(groupsWithMembers);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ message: 'Error fetching groups' });
  }
});





app.delete('/groups/:id', authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.group.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Formater deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete formater' });
  }
});



app.get("/groups/:id", authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: id},
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update Group by ID
app.put("/groups/:id", authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: id},
    });

    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Update the group
    const updatedGroup = await prisma.group.update({
      where: { id:id},
      data: {
        name,
        description,
      },
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});















app.get('/operateur/:id', authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberOfGroups: { // This is the relation field for the group
          select: { name: true } // Select only the group name
        }
      }
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.json({ 
      user: {
        ...user,
        groupName: user.memberOfGroups?.name // Add group name to the response
      } 
    });
  } catch (err) {
    res.status(500).send({ message: 'Failed to retrieve user' });
  }
});





// formateur update operatuer
app.put('/operateur/:id', authenticateFormateur, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule, address=null, phone=null, groupeId = null } = req.body;

  // Function to delete old image
  function deleteOldImage(imagePath) {
    const fullPath = path.resolve(imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${fullPath}`, err);
        } else {
          console.log(`Deleted old image: ${fullPath}`);
        }
      });
    } else {
      console.warn(`Image not found for deletion: ${fullPath}`);
    }
  }

  // Validate that all fields except image are provided
  if (!firstName || !lastName || !cin || !matricule ) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  try {
    // Fetch the existing user to get the current image path
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the phone number is already taken by another user
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhoneUser && existingPhoneUser.id !== req.params.id) {
      return res.status(400).json({ message: 'This phone number is already in use by another user' });
    }

    let imageURL = existingUser.image; // Default to existing image if no new one is uploaded

    // Check if a new image is uploaded
    if (req.file) {
      // Delete the old image if it's not the default one
      if (existingUser.image && existingUser.image !== '/default-avatar.jpg') {
        const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
        deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Delete the old image file
      }

      // Set the new image URL
      imageURL = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        cin,
        matricule,
        address,
        phone,
        groupeId,
        image: imageURL, // Only update the image if a new one is uploaded
      },
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        image: imageURL, // Ensure the correct image URL is returned
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
});




app.get('/operateur/check-phone/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res.status(200).json({ isPhoneTaken: true });
    }

    return res.status(200).json({ isPhoneTaken: false });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking phone number' });
  }
});






// Formateur update Operatuers passwords
app.put('/operateur/:id/password/update', authenticateFormateur, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required' });
  }

  try {
    // Fetch the existing user to verify the current password
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id }, // req.user.id should be set by your authentication middleware
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({
      message: 'Password updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});













app.get('/formateur/test/:id',authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the test along with related questions and answers
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
      include: {
        questions: {
          include: {
            answers: true,  // Include the answers related to each question
          },
        },
      },
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the test data' });
  }
});




app.delete('/formateur/test/:id',authenticateFormateur, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the test along with related questions and answers
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    else{
      await prisma.test.delete({
        where: {
          id: id,
        }
      });
      res.status(201).json({ error: 'test deleted succeffully' });
    }

    // res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the test data' });
  }
});












































// Endpoint to get user information
app.get("/operateur/:id/info", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user information with related data
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cin: true,
        matricule: true,
        role: true,
        image: true,
        address: true,
        phone: true,
        createdAt: true,
        formateur: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        memberOfGroups: {
          select: {
            name: true,
          },
        },
        testAttempts: {
          select: {
            id: true,
            test: {
              select: {
            
                title: true,
              },
            },
    
            score: true,
            completedAt: true,
            test: {
              select: {
                title:true,
                testPoints: true,
              },
            },
          },
        },
      },
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format the response
    const response = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      cin: user.cin,
      matricule: user.matricule,
      role: user.role,
      image: user.image,
      address: user.address,
      phone: user.phone,
      createdAt: user.createdAt,
      formateurName: user.formateur
        ? `${user.formateur.firstName} ${user.formateur.lastName}`
        : null,
      groupName: user.memberOfGroups ? user.memberOfGroups.name : null,
      testAttempts: user.testAttempts.map((attempt) => ({
        id:attempt.id,
        title: attempt.test.title,
        date: attempt.completedAt,
        score: attempt.score,
        testPoints: attempt.test.testPoints,
      })),
    };

    // Return the response
    console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information" });
  }
});








app.get('/api/groups',authenticateFormateur, async (req, res) => {
  const formateurId = req.user.id;
  try {
    const groups = await prisma.group.findMany({
      where:{leaderId:formateurId}
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get users by group
app.get('/api/users/:groupId',authenticateFormateur, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        groupeId: req.params.groupId
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get attendance for a specific date and group
app.get('/api/attendance',authenticateFormateur, async (req, res) => {
  const { date, groupId } = req.query;
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        date: new Date(date),
        groupId: groupId
      },
      include: {
        user: true
      }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Create or update attendance
app.post('/api/attendance',authenticateFormateur, async (req, res) => {
  const { userId, groupId, date, isPresent } = req.body;
  try {
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_groupId_date: {
          userId,
          groupId,
          date: new Date(date)
        }
      },
      update: {
        isPresent
      },
      create: {
        userId,
        groupId,
        date: new Date(date),
        isPresent
      }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});









// Input validation schema for creating/updating events
const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  date: Joi.date().iso().required(),
  startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:MM format
  endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:MM format
  todos: Joi.array().items(
    Joi.object({
      text: Joi.string().required()
    })
  ).optional()
});

// Middleware to check if an event belongs to the authenticated user
const checkEventOwnership = async (req, res, next) => {
  const { id } = req.params;
  const event = await prisma.event.findFirst({
    where: { id, userId: req.user.id }
  });

  if (!event) {
    return res.status(404).json({ error: 'Event not found or unauthorized' });
  }

  req.event = event; // Attach the event to the request object
  next();
};

// Get all events for the authenticated user
app.get('/events', authenticateFormateur, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.id },
      include: { todos: true },
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events. Please try again later.' });
  }
});

// Create a new event

app.post('/events', authenticateFormateur, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, date, startTime, endTime, todos } = value;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date), // Convert date to Date object
        startTime, // Store as string (e.g., "10:00")
        endTime, // Store as string (e.g., "11:00")
        userId: req.user.id,
        todos: {
          create: todos.map((todo) => ({
            text: todo.text,
            completed: false
          }))
        }
      },
      include: { todos: true }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event. Please try again later.' });
  }
});

// Update an event
app.put('/event/:id', authenticateFormateur, checkEventOwnership, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { title, description, date, startTime, endTime, todos } = value;

    // Delete existing todos
    await prisma.todo.deleteMany({ where: { eventId: id } });

    // Update event and create new todos
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date), // Convert date to Date object
        startTime, // Store as string (e.g., "10:00")
        endTime, // Store as string (e.g., "11:00")
        todos: {
          create: todos.map((todo) => ({
            text: todo.text,
            completed: false
          }))
        }
      },
      include: { todos: true }
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event. Please try again later.' });
  }
});

// Delete an event
app.delete('/event/:id', authenticateFormateur, checkEventOwnership, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete event (todos will be automatically deleted due to cascade)
    await prisma.event.delete({ where: { id } });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event. Please try again later.' });
  }
});

// Toggle todo completion status
app.patch('/todos/:id', authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!todo || !todo.event || todo.event.userId !== req.user.id) {
      return res.status(404).json({ error: 'Todo not found or unauthorized' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo. Please try again later.' });
  }
});





























app.put('/apii/test-attempts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    const updatedTestAttempt = await prisma.testAttempt.update({
      where: { id },
      data: { 
        score,
        correctAnswers: score // Since we're now using direct score instead of percentage
      }
    });

    res.json(updatedTestAttempt);
  } catch (error) {
    console.error('Error updating test attempt:', error);
    res.status(500).json({ error: 'Failed to update test attempt' });
  }
});

// Delete test attempt
app.delete('/apii/test-attempts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testAttempt.delete({ where: { id } });
    res.json({ message: 'Test attempt deleted successfully' });
  } catch (error) {
    console.error('Error deleting test attempt:', error);
    res.status(500).json({ error: 'Failed to delete test attempt' });
  }
});

// Update attendance
app.put('/apii/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isPresent } = req.body;

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: { isPresent }
    });

    res.json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Get operateur details with tests and attendance
app.get('/apii/operateur/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        formateur: true,
        memberOfGroups: {
          include: {
            _count: {
              select: { members: true }
            }
          }
        },
        testAttempts: {
          include: {
            test: true
          },
          orderBy: {
            completedAt: 'desc'
          }
        },
        Attendance: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const group = user.memberOfGroups;
    
    // Transform the data to match the frontend structure
    const transformedUser = {
      ...user,
      group: group ? {
        id: group.id,
        name: group.name,
        description: group.description,
        startDate: group.startDate,
        endDate: group.endDate,
        status: group.status,
        memberCount: group._count.members
      } : null,
      tests: user.testAttempts.map(attempt => ({
        id: attempt.id,
        title: attempt.test.title,
        date: attempt.completedAt,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.test.totalQuestions,
        testPoints: attempt.test.testPoints,
        difficulty: attempt.test.difficulty
      })),
      attendance: user.Attendance.map(record => ({
        id: record.id,
        date: record.date,
        isPresent: record.isPresent
      }))
    };

    res.json(transformedUser);
  } catch (error) {
    console.error('Error fetching fetching operateur details:', error);
    res.status(500).json({ error: 'Failed to fetch operateur details' });
  }
});









app.get('/api/analytics/operateurs/gender', authenticateFormateur,async (req, res) => {
  try {
    const { id } = req.user;
    const stats = await prisma.user.groupBy({
      by: ['gender'],
      where: {
        formateurId: id,
        role: 'OPERATEUR'
      },
      _count: {
        gender: true
      }
    });

    const formattedStats = stats.map(stat => ({
      genre: stat.gender === 'MALE' ? 'Homme' : 'Femme',
      nombre: stat._count.gender
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistiques des tests
app.get('/api/analytics/tests/stats',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const tests = await prisma.test.findMany({
      where: {
        creatorId: id
      },
      include: {
        testAttempts: true
      }
    });

    const stats = tests.map(test => ({
      titre: test.title,
      tentatives: test.testAttempts.length,
      moyenneScore: test.testAttempts.length > 0
        ? test.testAttempts.reduce((acc, curr) => acc + curr.score, 0) / test.testAttempts.length
        : 0
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistiques de présence
app.get('/api/analytics/attendance',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const attendance = await prisma.attendance.groupBy({
      by: ['date'],
      where: {
        group: {
          leaderId: id
        }
      },
      _count: {
        _all: true,
        isPresent: true
      }
    });

    const stats = attendance.map(day => ({
      date: day.date.toISOString().split('T')[0],
      presents: day._count.isPresent,
      absents: day._count._all - day._count.isPresent
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistiques des groupes
app.get('/api/analytics/groups',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const groups = await prisma.group.findMany({
      where: {
        leaderId: id
      },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    const stats = groups.map(group => ({
      nom: group.name,
      nombreOperateurs: group._count.members
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nouvelles routes...
// Distribution des difficultés des tests
app.get('/api/analytics/tests/difficulty',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const stats = await prisma.test.groupBy({
      by: ['difficulty'],
      where: {
        creatorId: id
      },
      _count: {
        _all: true
      }
    });

    const formattedStats = stats.map(stat => ({
      difficulte: stat.difficulty === 'EASY' ? 'Facile' : 
                  stat.difficulty === 'MEDIUM' ? 'Moyen' : 'Difficile',
      nombre: stat._count._all
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Performance mensuelle
app.get('/api/analytics/performance/monthly',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const attempts = await prisma.testAttempt.findMany({
      where: {
        test: {
          creatorId: id
        },
        completedAt: {
          gte: sixMonthsAgo
        }
      },
      include: {
        test: true
      }
    });

    const monthlyStats = attempts.reduce((acc, attempt) => {
      const month = format(new Date(attempt.completedAt), 'MMM yyyy', { locale: fr });
      if (!acc[month]) {
        acc[month] = {
          scores: [],
          success: 0,
          total: 0
        };
      }
      acc[month].scores.push(attempt.score);
      acc[month].success += attempt.score >= (attempt.test.testPoints / 2) ? 1 : 0;
      acc[month].total += 1;
      return acc;
    }, {});

    const stats = Object.entries(monthlyStats).map(([month, data]) => ({
      mois: month,
      moyenneScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      tauxReussite: (data.success / data.total) * 100
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compétences des opérateurs
app.get('/api/analytics/operateurs/skills',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const tests = await prisma.test.findMany({
      where: {
        creatorId: id
      },
      include: {
        testAttempts: true
      }
    });

    const categoriesScores = tests.reduce((acc, test) => {
      if (!acc[test.category || 'Non catégorisé']) {
        acc[test.category || 'Non catégorisé'] = {
          scores: [],
          total: 0
        };
      }
      
      test.testAttempts.forEach(attempt => {
        acc[test.category || 'Non catégorisé'].scores.push(
          (attempt.score / test.testPoints) * 100
        );
      });
      
      return acc;
    }, {});

    const stats = Object.entries(categoriesScores).map(([category, data]) => ({
      categorie: category,
      score: data.scores.reduce((a, b) => a + b, 0) / data.scores.length
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activité hebdomadaire
app.get('/api/analytics/activity',authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const [tests, attendance, events] = await Promise.all([
      prisma.test.findMany({
        where: {
          creatorId: id,
          createdAt: {
            gte: fourWeeksAgo
          }
        }
      }),
      prisma.attendance.findMany({
        where: {
          group: {
            leaderId: id
          },
          date: {
            gte: fourWeeksAgo
          }
        }
      }),
      prisma.event.findMany({
        where: {
          userId: id,
          date: {
            gte: fourWeeksAgo
          }
        }
      })
    ]);

    const weeklyStats = [...Array(4)].map((_, index) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (21 - (index * 7)));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return {
        semaine: `S${index + 1}`,
        tests: tests.filter(t => 
          new Date(t.createdAt) >= weekStart && new Date(t.createdAt) <= weekEnd
        ).length,
        presences: attendance.filter(a => 
          new Date(a.date) >= weekStart && new Date(a.date) <= weekEnd
        ).length,
        evenements: events.filter(e => 
          new Date(e.date) >= weekStart && new Date(e.date) <= weekEnd
        ).length
      };
    });

    res.json(weeklyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







app.get('/api/formateur/activities/today', authenticateFormateur, async (req, res) => {
  try {
    const { id } = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all activities in parallel
    const [tests, attendances, events, groupActivities, profileUpdates] = await Promise.all([
      prisma.test.findMany({
        where: {
          creatorId: id,
          OR: [
            { createdAt: { gte: today, lt: tomorrow } },
            { open_time: { gte: today, lt: tomorrow } },
          ],
        },
        include: {
          testAttempts: true,
        },
      }),
      prisma.attendance.findMany({
        where: {
          group: {
            leaderId: id,
          },
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          group: true,
        },
      }),
      prisma.event.findMany({
        where: {
          userId: id,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.group.findMany({
        where: {
          leaderId: id,
          OR: [
            { createdAt: { gte: today, lt: tomorrow } },
            { updatedAt: { gte: today, lt: tomorrow } },
          ],
        },
        include: {
          members: true,
        },
      }),
      prisma.user.findMany({
        where: {
          id: id,
          updatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    // Transform data into a unified format
    const activities = [
      ...tests.map((test) => ({
        type: 'test',
        title: test.title,
        time: test.open_time
          ? new Date(test.open_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : new Date(test.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: test.status === 'CLOSE' ? 'completed' : test.status === 'OPEN' ? 'in_progress' : 'pending',
        details: {
          participants: test.testAttempts.length,
          score:
            test.testAttempts.length > 0
              ? Math.round(
                  test.testAttempts.reduce((acc, curr) => acc + curr.score, 0) / test.testAttempts.length
                )
              : null,
        },
      })),
      ...attendances.map((attendance) => ({
        type: 'attendance',
        title: `Présence - ${attendance.group.name}`,
        time: new Date(attendance.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        details: {
          participants: attendance.group._count?.members || 0,
        },
      })),
      ...events.map((event) => ({
        type: 'event',
        title: event.title,
        time: event.startTime,
        status:
          new Date() > new Date(`${event.date}T${event.endTime}`)
            ? 'completed'
            : new Date() > new Date(`${event.date}T${event.startTime}`)
            ? 'in_progress'
            : 'pending',
        details: {
          duration: `${event.startTime} - ${event.endTime}`,
          location: event.description,
        },
      })),
      ...groupActivities.map((group) => ({
        type: 'group',
        title: `Groupe - ${group.name}`,
        time: new Date(group.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: group.updatedAt > group.createdAt ? 'updated' : 'created',
        details: {
          members: group.members.length,
        },
      })),
      ...profileUpdates.map((profile) => ({
        type: 'profile',
        title: `Mise à jour de profil`,
        time: new Date(profile.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'updated',
        details: {
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
      })),
    ];

    // Sort activities by time
    activities.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'An error occurred while fetching activities' });
  }
});













// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


