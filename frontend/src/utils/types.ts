export interface VideoData {
  videoPlay: boolean,
  title: string,
  channelName: string,
  views: number,
  thumbnailUrl: string,
  videoUrl: string,
  slug: string,
  date?: Date,
  likes?: number,
  dislikes?: number,
  comments?: Comments[],
  commentsCounts?: number,
  channelImage?: string,
  subscribers?: number,
  description?: string,
  tags?: string[],
  chaanelUrl?: string
}

export interface Comments {

}

export interface UserInfo {
  id: string,
  name: string,
  description: string,
  customUrl: string,
  profileImage: string,
  bannerImage: string,
  subscribers: number,
  totalViews: number,
  totalVideo?: number,
  createdAt: Date,
  history: [],
  watchLater: [],
  likedVideo: [],
  videos: VideoData[]
}