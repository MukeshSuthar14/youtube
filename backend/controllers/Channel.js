const Video = require("../models/Video");

class Channel {
    static async channelVideo(request, response) {
        try {
            let requestId = request?.params?.id ?? null;
            const videos = Video.find({ uploader: requestId });

            response.status(200).json({
                message: "Success",
                videos: videos
            });
            return;
        } catch (error) {
            response.status(500).json({ message: "Something Went Wrong" });
            return;
        }
    }
}

module.exports = Channel;