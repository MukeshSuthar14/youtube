const fs = require('fs');
var mime = require('mime-types');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const { createSlug } = require('../utils/helper');
const Video = require('../models/Video');
const moment = require('moment');

class Watch {
    static async notwatchVideo(request, response) {
        try {
            const videoId = request?.params?.id;
            if (!videoId) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                return response.end('Video ID is required');
            }

            const getVideo = await Video.findOne({ slug: videoId });
            if (!getVideo) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                return response.end('Video Not Found');
            }

            const videoPath = path.resolve(`${BASE_PATH}/storage/videos/${getVideo?.videoUrl}`);
            if (!fs.existsSync(videoPath)) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('Video not found');
            }

            ffmpeg.setFfmpegPath(ffmpegInstaller.path);
            const range = request.headers.range;
            let mimeType = mime.lookup(videoPath) || 'application/octet-stream'; // Fluent will transcode to MP4 format
            mimeType = mimeType === "application/mp4" ? "video/mp4" : mimeType;

            // If no range, stream entire video (with transcoding)
            if (!range) {
                response.writeHead(200, {
                    'Content-Type': mimeType,
                    'Transfer-Encoding': 'chunked',
                });

                ffmpeg(videoPath)
                    .format('mp4')
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .outputOptions([
                        '-movflags frag_keyframe+empty_moov', // allow streaming
                        '-preset veryfast',
                        '-crf 23'
                    ])
                    .on('error', (err) => {
                        console.error('FFmpeg error:', err);
                        response.end('Error streaming video');
                    })
                    .pipe(response, { end: true });

                return;
            }

            // If range is present, extract start and end
            const stats = fs.statSync(videoPath);
            const fileSize = stats.size;

            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunkSize = end - start + 1;

            // Response headers for partial content
            response.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': mimeType
            });

            // Use a read stream and pipe into ffmpeg
            ffmpeg(fs.createReadStream(videoPath, { start, end }))
                .format('mp4')
                .videoCodec('libx264')
                .audioCodec('aac')
                .outputOptions([
                    '-movflags frag_keyframe+empty_moov',
                    '-preset veryfast',
                    '-crf 23'
                ])
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    response.end('Error streaming video');
                })
                .pipe(response, { end: true });

        } catch (err) {
            console.error('Error streaming video:', err);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        }
    }
    static async watchVideo(request, response) {
        try {
            const isMediaStream = request.headers.range || request.headers['sec-fetch-dest'] === 'video';
            if (!isMediaStream) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                return response.end('Something went wrong.');
            }

            const videoId = request?.params?.id;
            if (!videoId) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                return response.end('Video ID is required');
            }

            const getVideo = await Video.findOne({ slug: videoId });
            if (!getVideo) {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                return response.end('Video Not Found');
            }

            const videoPath = path.resolve(`${BASE_PATH}/storage/videos/${getVideo?.videoUrl}`);
            if (!fs.existsSync(videoPath)) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                return response.end('Video not found');
            }

            return fs.createReadStream(videoPath).pipe(response);
        } catch (err) {
            console.error('Error streaming video:', err);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        }
    }

    static async images(request, response) {
        try {
            const segments = request.path.split('/').filter(Boolean);
            const fileName = path.join(BASE_PATH, "storage", segments[0], request?.params?.name);
            if (fs.existsSync(fileName)) {
                fs.createReadStream(fileName).pipe(response);
            } else {
                throw new Error("File Not Exists.");
            }
        } catch (error) {
            response.status(404).json({ message: "Image Not Found" });
            return;
        }
    }

    static validateUpload = [

    ]

    static async upload(request, response) {
        try {
            ffmpeg.setFfmpegPath(ffmpegInstaller.path);
            ffmpeg.setFfprobePath(ffprobeInstaller.path);

            const {
                category = "",
                city = "",
                country = "",
                description = "",
                isPublished = false,
                tags = "",
                title = "",
                visibility = "public"
            } = request?.body;

            var uploadedVideoPath;
            if (request?.files?.videoFile) {
                let fileName = request?.files?.videoFile?.name;
                uploadedVideoPath = path.parse(fileName).name + '_' + moment().utc().format('x') + path.extname(fileName);
                request?.files?.videoFile?.mv(path.join(BASE_PATH, "storage", "videos", uploadedVideoPath));
            }

            var thumbnailFilePath;
            if (request?.files?.thumbnailFile) {
                let fileName = request?.files?.thumbnailFile?.name;
                thumbnailFilePath = path.parse(fileName).name + '_' + moment().utc().format('x') + path.extname(fileName);
                request?.files?.thumbnailFile?.mv(path.join(BASE_PATH, "storage", "thumbnails", thumbnailFilePath));
            } else {
                const generatedThumbnailFilePath = await Watch.generateThumbnail(path.join(BASE_PATH, "storage", "videos", uploadedVideoPath), './storage/thumbnails', path.parse(uploadedVideoPath).name + '_' + moment().utc().format('x') + "_thumbnail.png");
                thumbnailFilePath = generatedThumbnailFilePath;
            }

            var resolution = [];
            if (uploadedVideoPath) {
                const videoResolution = await Watch.getVideoResolution(path.join(BASE_PATH, "storage", "videos", uploadedVideoPath));
                if (videoResolution) resolution = videoResolution;
            }

            var duration;
            if (uploadedVideoPath) {
                const videoDuration = await Watch.getVideoDuration(path.join(BASE_PATH, "storage", "videos", uploadedVideoPath));
                if (videoDuration) duration = videoDuration;
            }

            var slug = createSlug(title), counter = 0;
            var urlExists = await Video.findOne({ slug });
            while (urlExists !== null) {
                urlExists = await Video.findOne({ slug: slug + counter });
                counter++;
            }
            slug = slug + counter;

            const formData = {
                title: title,
                description: description,
                slug: slug,
                videoUrl: uploadedVideoPath,
                thumbnailUrl: thumbnailFilePath,
                duration: duration, // in seconds
                resolution: [resolution?.height], // e.g., ["720p", "1080p"]
                uploader: request?.user?.userId,
                category: category,
                tags: tags.split(","),
                isPublished: isPublished,
                publishDate: new Date(),
                visibility: visibility,
                status: 'ready',
                location: {
                    country: country,
                    city: city
                },
            };

            const result = await Video.insertOne(formData);
            if (result) {
                response.status(200).json({ message: "Video Uploaded Successfully" });
                return;
            } else {
                response.status(400).json({ message: "Something went wrong. please try again!" });
                return;
            }
        } catch (error) {
            response.status(500).json({ message: "Something Went Wrong. Please Try Again!" });
            return;
        }
    }

    static generateThumbnail(videoPath, outputFolder, thumbnailName = 'thumbnail.png') {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .on('end', () => {
                    console.log('Thumbnail created successfully');
                    resolve(thumbnailName);
                })
                .on('error', (err) => {
                    console.error('Error generating thumbnail:', err);
                    reject(err);
                })
                .screenshots({
                    count: 1,
                    folder: outputFolder,
                    filename: thumbnailName,
                    size: '320x240',
                    timemarks: ['00:00:05.000'] // 1 second into the video
                });
        });
    }

    static getVideoDuration = (filePath) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(err);
                const durationInSeconds = metadata.format.duration;
                resolve(durationInSeconds);
            });
        });
    }

    static getVideoResolution = (filePath) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(err);

                // Find the video stream
                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (!videoStream) return reject(new Error('No video stream found'));

                const width = videoStream.width;
                const height = videoStream.height;

                resolve({ width, height });
            });
        });
    }

    static async videoList(request, response) {
        try {
            const videos = await Video.find({ deleted: false, visibility: "public" }).populate('uploader').limit(20);
            response.status(200).json({
                status: true,
                videos: videos.map(video => ({
                    slug: video?.slug,
                    videoPlay: false,
                    title: video?.title,
                    channelName: video?.uploader?.name,
                    views: video?.totalViews,
                    thumbnailUrl: video?.thumbnailUrl,
                    videoUrl: video?.videoUrl
                }))
            });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: "Something Went Wrong. Please Try Again!" });
            return;
        }
    }

    static async videoInfo(request, response) {
        try {
            const slug = request.params.slug;
            const video = await Video.findOne({ slug, deleted: false, visibility: "public" }).populate('uploader');
            response.status(200).json({
                status: true,
                video: {
                    date: video?.publishDate,
                    likes: video?.likes,
                    dislikes: video?.dislikes,
                    description: video?.description,
                    tags: video?.tags,
                    comments: [],
                    commentsCounts: 0,
                    slug: video?.slug,
                    videoPlay: false,
                    title: video?.title,
                    channelName: video?.uploader?.name,
                    channelImage: video?.uploader?.profileImage,
                    chaanelUrl: video?.uploader?.customUrl,
                    subscribers: video?.uploader?.subscribers,
                    views: video?.totalViews,
                    thumbnailUrl: video?.thumbnailUrl,
                    videoUrl: video?.videoUrl
                }
            });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: "Something Went Wrong. Please Try Again!" });
            return;
        }
    }
}

module.exports = Watch;