const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const path = require("path");
const bcrypt = require('bcryptjs');
const constants = require('../config/constants');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { createSlug } = require('../utils/helper');
const Video = require('../models/Video');

class Login {

    static loginValidateForm = [

        check('email')
            .trim()
            .notEmpty()
            .escape()
            .withMessage("Email is required"),

        check('password')
            .trim()
            .notEmpty()
            .escape()
            .withMessage("Password is required")
    ]

    static async login(request, response) {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json(errors.array());
            return;
        }

        const {
            email,
            password
        } = request.body;

        const user = await User.findOne({ email });

        if (!user) {
            response.status(500).json({ message: "User Not Found" });
            return;
        }

        if (user && user.password && await bcrypt.compare(password, user.password)) {
            if (user?.status && user?.status !== constants.STATUS_ACTIVE) {
                response.status(500).json({ message: "User Not Found" });
                return;
            }

            const jetData = {
                time: moment().format("YYYY-MM-DD HH:mm:ss"),
                userId: user?._id
            };

            const jwtToken = jwt.sign(jetData, constants.JWT_SECRET_KEY, {
                expiresIn: constants.JWT_EXPIRES_IN
            });

            response.status(200).json({
                id: btoa(user?._id),
                name: user?.name,
                email: user?.email,
                profileImage: user?.profileImage,
                bannerImage: user?.bannerImage,
                token: jwtToken,
                message: "Login Successfully!"
            });
            return;
        } else {
            response.status(500).json({ message: "Incorrect login details!" });
            return;
        }
    }

    static registerFormValidation = [

    ]

    static async register(request, response) {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json(errors.array());
            return;
        }

        const {
            name = "",
            email = "",
            password = "",
            channelDescription = null,
            country = null,
            category = null,
            socialLinks = null
        } = request?.body;

        try {
            if (email) {
                const checkUser = await User.findOne({ email });
                if (checkUser) {
                    response.status(400).json({ message: "Email Id already exists. please try again!" });
                    return;
                }
            }

            var customUrl = createSlug(name), counter = 0;
            var urlExists = await User.findOne({ customUrl });
            while (urlExists !== null) {
                urlExists = await User.findOne({ customUrl: customUrl + counter });
                counter++;
            }
            customUrl = customUrl + counter;

            var uploadedProfileImagePath, uploadedBannerImagePath;
            if (request?.files?.profileImage) {
                let fileName = request?.files?.profileImage?.name;
                uploadedProfileImagePath = path.parse(fileName).name + '_' + moment().utc().format('x') + path.extname(fileName);
                request?.files?.profileImage?.mv(path.join(BASE_PATH, "storage", "images", uploadedProfileImagePath));
            }
            if (request?.files?.bannerImage) {
                let fileName = request?.files?.bannerImage?.name;
                uploadedBannerImagePath = path.parse(fileName).name + '_' + moment().utc().format('x') + path.extname(fileName);
                request?.files?.bannerImage?.mv(path.join(BASE_PATH, "storage", "banners", uploadedBannerImagePath));
            }
            const result = await User.insertOne({
                name,
                email,
                password: await bcrypt.hash(password, constants.HASH_BCRYPT_ROUND),
                profileImage: uploadedProfileImagePath,
                bannerImage: uploadedBannerImagePath,
                channelDescription,
                country,
                customUrl,
                category,
                socialLinks: {
                    twitter: socialLinks?.twitter ?? null,
                    instagram: socialLinks?.instagram ?? null,
                    website: socialLinks?.website ?? null
                },
                lastLogin: null
            });
            if (result?._id) {
                response.status(200).json({ message: "User Register Successfully" });
                return;
            } else {
                response.status(400).json({ message: "Something went wrong. please try again!" });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
            return;
        }
    }

    static async logout(request, response) {
        response.status(200).json({ message: "Logout Successfully!" });
    }

    static async user(request, response) {
        let requestId = request?.params?.id ?? null;

        let user;
        if (!requestId) {
            // For Not Giving Id for User
            requestId = request?.user?.userId;
        } else {
            // For @name Query
            user = await User.findOne({ customUrl: requestId.replace("@", "") });
            if (!user) {
                requestId = atob(requestId);
            }
        }

        if (!user) {
            // For Giving id params
            user = await User.findOne({ _id: requestId });
            if (!user) {
                response.status(500).json({ message: "User Not Found" });
                return;
            }
        }

        const videos = Video.find({ uploader: requestId });
        console.log("Videos =>>", videos, typeof videos, Array.isArray(videos));
        

        response.status(200).json({
            id: btoa(user?._id),
            name: user?.name,
            description: user?.channelDescription,
            customUrl: user?.customUrl,
            profileImage: user?.profileImage,
            bannerImage: user?.bannerImage,
            subscribers: user?.subscribers,
            totalViews: user?.totalViews,
            createdAt: user?.createdAt,
            history: [],
            watchLater: [],
            likedVideo: [],
            videos: videos.map(video => ({
                title: video.title
            }))
        });
        return;
    }
}

module.exports = Login;