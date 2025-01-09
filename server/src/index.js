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

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import authenticateAdmin from "./middlewares/authenticateAdmin.js";

const prisma = new PrismaClient();
const app = express();
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
  const { firstName,lastName,cin,matricule,password,role, image ,address,phone,formateurId} = req.body;
  // Validate role
  if (!["ADMIN", "FORMATEUR","OPERATEUR"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { firstName:firstName,lastName:lastName,cin:cin,matricule:matricule,password: hashedPassword, role,image },
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


// app.get('/formateur/operateurs', authenticateFormateur, async (req, res) => {
//   const formateurId = req.user.id;

//   try {
//     // Fetch users with their formateur's data and group memberships
//     const users = await prisma.user.findMany({
//       where: {
//         formateurId: formateurId
//       },
//       include: {
//         formateur: {
//           select: {
//             firstName: true,
//             lastName: true,
//           },
//         },
//         memberOfGroups: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });

//     // Map users to include formateur name and group(s)
//     const usersWithFormateurAndGroups = users.map(user => {
//       // Check if user has groups, then map them
//       const groupNames = user.memberOfGroups && user.memberOfGroups.length > 0
//         ? user.memberOfGroups.map(group => group.name)
//         : []; // If no groups, set it to an empty array

//       return {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         cin: user.cin,
//         matricule: user.matricule,
//         role: user.role,
//         image: user.image,
//         address: user.address,
//         groups: groupNames.length > 0 ? groupNames[0] : null, // Include groups if available
//         phone: user.phone,
//         formateur: user.formateur
//           ? `${user.formateur.firstName} ${user.formateur.lastName}`
//           : null, // Include formateur's full name if available
//       };
//     });

//     // Send the users data with groups and formateur info to the frontend
//     return res.status(200).json(usersWithFormateurAndGroups);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return res.status(500).json({ message: 'Error fetching users' });
//   }
// });


// app.get('/formateur/operateurs', authenticateFormateur, async (req, res) => {

//   const formateurId = req.user.id;
//   try {
//     // Fetch users with their formateur's data
//     const users = await prisma.user.findMany({
//       where: {
//         formateurId:formateurId
//       },
      
//       include: {
//         formateur: {
//           select: {
//             firstName: true,
//             lastName: true,
//           },
//         },
//         memberOfGroups: {
//           select: {
//             name: true,
//           },
//         },
//       },

//     });

//     // Map users to include formateur name
//     const usersWithFormateur = users.map(user => ({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       cin: user.cin,
//       matricule: user.matricule,
//       role: user.role,
//       image: user.image,
//       address: user.address,
//       groupe:user.memberOfGroups.name ? user.memberOfGroups.name:null,
//       phone: user.phone,
//       formateur: user.formateur
//       ? `${user.formateur.firstName} ${user.formateur.lastName}`
//       : null, // Include formateur's full name if available
//     }));

//     // Send the users data to the frontend
//     return res.status(200).json(usersWithFormateur);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return res.status(500).json({ message: 'Error fetching users' });
//   }
// });


// app.get('/admin/users', authenticateAdmin, async (req, res) => {
//   try {
//     // Fetch users from the database
//     const users = await prisma.user.findMany({
//       where: {
//         role: {
//           not: "ADMIN",
//         },
//       },
//     });
    
//     // Map users to include full image URL and other necessary fields
//     const usersWithImageUrl = users.map(user => ({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       cin: user.cin,
//       matricule: user.matricule,
//       role: user.role,
//       image: user.image, // Assuming 'image' field contains file name
//       address:user.address,
//       phone:user.phone,
//       formateur:null
//     }));

//     // Send the users data to the frontend
//     return res.status(200).json(usersWithImageUrl);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return res.status(500).json({ message: 'Error fetching users' });
//   }
// });



// Admin Create Users

app.post('/admin/users/create', authenticateAdmin, multer({ storage }).single('image'), async (req, res) => {
  const { firstName, lastName, cin, matricule, password, role } = req.body;
  const image = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Image URL

  if (!firstName || !lastName || !cin || !matricule || !password || !role) {
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
        formateurId:parseInt(req.body.formateurId)
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
    const { firstName, lastName, cin, matricule, password } = req.body;
    const image = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Image URL

    // Retrieve the formateurId from the authenticated user
    const formateurId = req.user?.id; // Assuming req.user contains the authenticated user info
    const role = "OPERATEUR"; // Default role is OPERATEUR

    // Validate required fields
    if (!firstName || !lastName || !cin || !matricule || !password) {
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

// const createQuizWithQuestions = async ({ quizData, questions, files }) => {
//   return await prisma.$transaction(async (prisma) => {
//     // Create the quiz first
//     const quiz = await prisma.quiz.create({
//       data: quizData
//     });

//     // Create questions with their answers
//     for (let i = 0; i < questions.length; i++) {
//       const question = questions[i];
//       const questionFile = files.find(f => f.fieldname === `questionImage_${i}`);

//       const newQuestion = await prisma.question.create({
//         data: {
//           text: question.text,
//           type: question.type,
//           point: parseFloat(question.point),
//           quizId: quiz.id,
//           imageUrl: questionFile ? questionFile.filename : null,
//         },
//       });

//       // Create answers for the question
//       const answers = question.answers || [];
//       await Promise.all(answers.map(answer => 
//         prisma.answer.create({
//           data: {
//             text: answer.text,
//             isCorrect: answer.isCorrect,
//             questionId: newQuestion.id,
//           },
//         })
//       ));
//     }

//     return quiz;
//   });
// };

// const createQuiz = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       code,
//       category,
//       difficulty,
//       testPoints,
//       openTime,
//       closeTime,
//       timeLimit,
//       questions: questionsJson
//     } = req.body;

//     // Validate required fields
//     if (!title || !description || !code || !difficulty || !testPoints) {
//       return res.status(400).json({ 
//         error: 'Invalid input data. Please provide all required fields.' 
//       });
//     }

//     const questions = JSON.parse(questionsJson);
//     const creatorId = req.user.id;
//     const files = req.files || [];

//     const quiz = await createQuizWithQuestions({
//       quizData: {
//         title,
//         description,
//         code,
//         category,
//         difficulty,
//         testPoints: parseInt(testPoints),
//         creatorId,
//         open_time: openTime ? new Date(openTime) : null,
//         close_time: closeTime ? new Date(closeTime) : null,
//         timeLimit: timeLimit ? parseInt(timeLimit) : null,
//       },
//       questions,
//       files
//     });

//     res.status(201).json({
//       message: 'Quiz created successfully.',
//       id: quiz.id,
//     });
//   } catch (error) {
//     console.error('Error creating quiz:', error);
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Invalid or expired token.' });
//     }
//     res.status(500).json({ error: 'Failed to create quiz.' });
//   }
// };

// const storage2 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });


// const upload = multer({ 
//   storage2,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// app.post('/formateur/quizzes', 
//   authenticateFormateur,
//   upload.array('questionImage', 50), // Allow multiple images, max 50
//   createQuiz
// );

















  // app.post('/questions', multer({ storage }).single('imageFile'), async (req, res) => {
  //   const { quizId, text, type ,point} = req.body;
  //   try {
  //     console.log('Request Body:', req.body);
  //     console.log('File:', req.file);
  
  //     const newQuestion = await prisma.question.create({
  //       data: {
  //         text,
  //         type,
  //         point:parseFloat(point),
  //         quizId: parseInt(quizId),
  //         imageUrl: req.file ? req.file.filename : null,
  //       },
  //     });
  
  //     if (type === 'IMAGE' && req.body.numberAnswers) {
  //       const numberAnswers = JSON.parse(req.body.numberAnswers);
  //       for (const answer of numberAnswers) {
  //         await prisma.numberAnswer.create({
  //           data: {
  //             number: answer.number,
  //             text: answer.text,
  //             questionId: newQuestion.id,
  //           },
  //         });
  //       }
  //     } else if (req.body.answers) {
  //       const answers = JSON.parse(req.body.answers);
  //       for (const answer of answers) {
  //         await prisma.answer.create({
  //           data: {
  //             text: answer.text,
  //             isCorrect: answer.isCorrect,
  //             questionId: newQuestion.id,
  //           },
  //         });
  //       }
  //     }
  
  //     res.status(201).json(newQuestion);
  //   } catch (error) {
  //     console.error('Error creating question:', error);
  //     res.status(500).json({ error: 'Failed to create question' });
  //   }
  // });




  
  // app.post('/formateur/questions', authenticateFormateur,multer({ storage }).single('imageFile'), async (req, res) => {
  //   const { quizId, text, type ,point} = req.body;
  //   try {
  //     console.log('Request Body:', req.body);
  //     console.log('File:', req.file);
  
  //     const newQuestion = await prisma.question.create({
  //       data: {
  //         text,
  //         type,
  //         point:parseFloat(point),
  //         quizId: parseInt(quizId),
  //         imageUrl: req.file ? req.file.filename : null,
  //       },
  //     });
  
  //     if (type === 'IMAGE' && req.body.numberAnswers) {
  //       const numberAnswers = JSON.parse(req.body.numberAnswers);
  //       let counter = 1;
  //       for (const answer of numberAnswers) {
  //         await prisma.answer.create({
  //           data: {
  //             answerNumber: counter,
  //             text: answer.text,
  //             questionId: newQuestion.id,
  //             isCorrect:true,
  //           },
  //         });
  //         counter++;
  //       }

  //     } else if (req.body.answers) {
  //       const answers = JSON.parse(req.body.answers);
  //       for (const answer of answers) {
  //         await prisma.answer.create({
  //           data: {
  //             text: answer.text,
              
  //             isCorrect: answer.isCorrect,
  //             questionId: newQuestion.id,
  //           },
  //         });
  //       }
  //     }
  
  //     res.status(201).json(newQuestion);
  //   } catch (error) {
  //     console.error('Error creating question:', error);
  //     res.status(500).json({ error: 'Failed to create question' });
  //   }
  // });




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







// app.post("/quiz-attempts", authenticateOPERATEUR,async (req, res) => {
//   const { quizId, answers } = req.body;

//   const userId = req.user?.id;

//   try {
//     // Validate input
//     if (!userId || !quizId || !Array.isArray(answers)) {
//       return res.status(400).json({ error: "Invalid input format" });
//     }

//     // Check if the quiz exists
//     const quiz = await prisma.test.findUnique({
//       where: { id: quizId },
//       include: { questions: { include: { answers: true } } },
//     });

//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }

//     // Check if the user exists
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if the user has already attempted the quiz
//     const existingAttempt = await prisma.testAttempt.findUnique({
//       where: {
//         // Use the correct compound key format
//         userId_testId: {
//           userId: userId,
//           testId: quizId,
//         },
//       },
//     });

//     if (existingAttempt) {
//       return res
//         .status(400)
//         .json({ error: "User has already attempted this quiz" });
//     }

//     // Calculate the score and correct answers
//     let score = 0;
//     let correctAnswers = 0;

//     for (const answer of answers) {
//       const question = quiz.questions.find((q) => q.id === answer.questionId);
//       if (!question) continue;

//       // Extract correct answers for the question
//       const correctAnswerIds = question.answers
//         .filter((a) => a.isCorrect)
//         .map((a) => a.id);

//       // Compare submitted answers with correct answers
//       const isCorrect =
//         correctAnswerIds.length === answer.selectedAnswerIds.length &&
//         correctAnswerIds.every((id) => answer.selectedAnswerIds.includes(id));

//       if (isCorrect) {
//         score += question.point;
//         correctAnswers += 1;
//       }
//     }

//     // Save the quiz attempt in the database
//     const quizAttempt = await prisma.testAttempt.create({
//       data: {
//         userId,
//         testId:quizId,
//         score,
//         correctAnswers,
//         totalQuestions: quiz.questions.length,
//       },
//     });

//     return res.status(201).json({ success: true, quizAttempt });
//   } catch (error) {
//     console.error("Error submitting quiz attempt:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
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

// app.put('/operateur/:id', authenticateFormateur, multer({ storage }).single('image'), async (req, res) => {
//   const { firstName, lastName, cin, matricule, address, phone, groupeId = null } = req.body;

//   // Function to delete old image
//   function deleteOldImage(imagePath) {
//     const fullPath = path.resolve(imagePath);
//     if (fs.existsSync(fullPath)) {
//       fs.unlink(fullPath, (err) => {
//         if (err) {
//           console.error(`Failed to delete old image: ${fullPath}`, err);
//         } else {
//           console.log(`Deleted old image: ${fullPath}`);
//         }
//       });
//     } else {
//       console.warn(`Image not found for deletion: ${fullPath}`);
//     }
//   }

//   // Validate that all fields except image are provided
//   if (!firstName || !lastName || !cin || !matricule || !address || !phone) {
//     return res.status(400).json({ message: 'All fields except image are required' });
//   }

//   try {
//     // Fetch the existing user to get the current image path
//     const existingUser = await prisma.user.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the phone number is already taken by another user
//     const existingPhoneUser = await prisma.user.findUnique({
//       where: { phone },
//     });

//     if (existingPhoneUser && existingPhoneUser.id !== req.params.id) {
//       return res.status(400).json({ message: 'This phone number is already in use by another user' });
//     }

//     let imageURL = existingUser.image; // Default to existing image if no new one is uploaded

//     // Check if a new image is uploaded
//     if (req.file) {
//       // Delete the old image
//       if (existingUser.image) {
//         const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
//         deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Delete the old image file
//       }

//       // Set the new image URL
//       imageURL = `${BASE_URL}/uploads/${req.file.filename}`;
//     }

//     // Update the user
//     const updatedUser = await prisma.user.update({
//       where: { id: req.params.id },
//       data: {
//         firstName,
//         lastName,
//         cin,
//         matricule,
//         address,
//         phone,
//         groupeId,
//         image: imageURL, // Only update the image if a new one is uploaded
//       },
//     });

//     return res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         ...updatedUser,
//         image: imageURL, // Ensure the correct image URL is returned
//       },
//     });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return res.status(500).json({ message: 'Error updating profile' });
//   }
// });

// app.put('/operateur/:id', authenticateFormateur, multer({ storage }).single('image'), async (req, res) => {
//   const { firstName, lastName, cin, matricule ,address, phone, groupeId=null } = req.body;

//   function deleteOldImage(imagePath) {
//     const fullPath = path.resolve(imagePath); // Make sure we get an absolute path
//     if (fs.existsSync(fullPath)) {
//       fs.unlink(fullPath, (err) => {
//         if (err) {
//           console.error(`Failed to delete old image: ${fullPath}`, err);
//         } else {
//           console.log(`Deleted old image: ${fullPath}`);
//         }
//       });
//     } else {
//       console.warn(`Image not found for deletion: ${fullPath}`);
//     }
//   }

//   if (!firstName || !lastName || !cin || !matricule || !address || !phone) {
//     return res.status(400).json({ message: 'All fields except image are required' });
//   }

//   try {
//     // Fetch the existing user to get the current image path
//     const existingUser = await prisma.user.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if phone number is already taken by another user (excluding the current user)
//     const existingPhoneUser = await prisma.user.findUnique({
//       where: { phone },
//     });

//     if (existingPhoneUser && existingPhoneUser.id !== req.params.id) {
//       return res.status(400).json({ message: 'This phone number is already in use by another user' });
//     }

//     let imageURL;

//     // Check if a new image was uploaded
//     if (req.file) {
//       // Build the full URL for the uploaded image
//       imageURL = `${BASE_URL}/uploads/${req.file.filename}`;

//       // Delete the previous image if it exists
//       if (existingUser.image) {
//         // Extract the local file path from the image URL
//         const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
//         deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Adjust the path for the 'uploads' directory
//       }
//     }

//     const updateData = {
//       firstName,
//       lastName,
//       cin,
//       matricule,
//       address,
//       phone,
//       groupeId,
//       ...(imageURL && { image: imageURL }), // Only include the image URL if an image was uploaded
//     };

//     const updatedUser = await prisma.user.update({
//       where: { id: req.params.id },
//       data: updateData,
//     });

//     return res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         ...updatedUser,
//         image: updateData.image || updatedUser.image, // Ensure the correct image URL is returned
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error updating profile' });
//   }
// });


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


// app.put('/operateur/:id', authenticateFormateur, multer({ storage }).single('image'), async (req, res) => {
//   const { firstName, lastName, cin, matricule ,address,phone,groupeId=null } = req.body;
  
//   function deleteOldImage(imagePath) {
//     const fullPath = path.resolve(imagePath); // Make sure we get an absolute path
//     if (fs.existsSync(fullPath)) {
//       fs.unlink(fullPath, (err) => {
//         if (err) {
//           console.error(`Failed to delete old image: ${fullPath}`, err);
//         } else {
//           console.log(`Deleted old image: ${fullPath}`);
//         }
//       });
//     } else {
//       console.warn(`Image not found for deletion: ${fullPath}`);
//     }
//   }

//   if (!firstName || !lastName || !cin || !matricule || !address || !phone) {
//     return res.status(400).json({ message: 'All fields except image are required' });
//   }

//   try {
//     // Fetch the existing user to get the current image path
//     const existingUser = await prisma.user.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let imageURL;

//     // Check if a new image was uploaded
//     if (req.file) {
//       // Build the full URL for the uploaded image
//       imageURL = `${BASE_URL}/uploads/${req.file.filename}`;

//       // Delete the previous image if it exists
//       if (existingUser.image) {
//         // Extract the local file path from the image URL
//         const oldImagePath = existingUser.image.replace(`${BASE_URL}/`, '');
//         deleteOldImage(path.join(__dirname, 'uploads', oldImagePath)); // Adjust the path for the 'uploads' directory
//       }
//     }

//     const updateData = {
//       firstName,
//       lastName,
//       cin,
//       matricule,
//       address,
//       phone,
//       groupeId,
//       ...(imageURL && { image: imageURL }), // Only include the image URL if an image was uploaded
//     };

//     const updatedUser = await prisma.user.update({
//       where: { id: req.params.id },
//       data: updateData,
//     });

//     return res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         ...updatedUser,
//         image: updateData.image || updatedUser.image, // Ensure the correct image URL is returned
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error updating profile' });
//   }
// });




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



































// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


