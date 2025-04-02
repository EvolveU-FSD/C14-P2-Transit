const mongodb = require('../data/database');
const bcrypt = require('bcrypt');

const userSchema = {
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    name: { type: String },
    provider: { type: String, required: true }, 
    providerId: { type: String }, 
    socialLogin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "User"; 

const getUserModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, userSchema, COLLECTION_NAME);
};

const login = async (req, res) => {
    try {
        
        
        // Input validation
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const { email, password } = req.body;
        const User = getUserModel();

        // Find user in database and validate password
        const user = await User.findOne({ email }).exec();
        
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ 
                message: "Invalid credentials"
            });
        }
  
        // Create JWT token using environment variable for secret
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: "1h",
            }
        );
  
        res.status(200).json({ 
            token,
            message: "Login successful"
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: "An error occurred during login" 
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name, provider, providerId } = req.body;
        
        const User = getUserModel();

        // Check if user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).json({ 
                message: "User already exists" 
            });
        }

        let newUser;

        // Handle social signup
        if (provider) {
            newUser = new User({
                email,
                name,
                provider,        // 'google', 'facebook', etc.
                providerId,      // ID from the social provider
                socialLogin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } 
        // Handle regular signup
        else {
            // Validate password for regular signup
            if (!password || password.length < 6) {
                return res.status(400).json({ 
                    message: "Password must be at least 6 characters long" 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            newUser = new User({
                email,
                password: hashedPassword,
                name,
                provider: 'local',
                socialLogin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        // Save user to database
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { 
                userId: newUser._id,
                email: newUser.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            token,
            message: "User created successfully",
            userId: newUser._id
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ 
            message: "An error occurred during signup" 
        });
    }
};

const verifySocialToken = async (req, res) => {
    try {
        const { token, provider } = req.body;
        
        let socialUserInfo;

        switch(provider) {
            case 'google':
                // Verify Google token and get user info
                // You'll need to implement this using Google's OAuth library
                break;
            case 'facebook':
                // Verify Facebook token and get user info
                // You'll need to implement this using Facebook's SDK
                break;
            default:
                return res.status(400).json({ 
                    message: "Unsupported social provider" 
                });
        }

        if (!socialUserInfo) {
            return res.status(401).json({ 
                message: "Invalid social token" 
            });
        }

        const User = getUserModel();
        
        // Find or create user
        let user = await User.findOne({ 
            email: socialUserInfo.email 
        }).exec();

        if (!user) {
            // Create new user from social login
            user = new User({
                email: socialUserInfo.email,
                name: socialUserInfo.name,
                provider,
                providerId: socialUserInfo.id,
                socialLogin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await user.save();
        }

        // Create JWT token
        const jwtToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token: jwtToken,
            message: "Social login successful",
            userId: user._id
        });

    } catch (err) {
        console.error('Social verification error:', err);
        res.status(500).json({ 
            message: "An error occurred during social login" 
        });
    }
};

module.exports = {
    login,
    register
};
