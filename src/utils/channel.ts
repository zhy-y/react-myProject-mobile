import { Channel } from "@/types/data";

const CHANNEL_KEY = 'channels'

export const setChannels = (channels: Channel[]) => {
    localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
}

export const getChannels = (): Channel[] => {
    return JSON.parse(localStorage.getItem(CHANNEL_KEY) || '[]')
}

export const removeChannels = () => {
    localStorage.removeItem(CHANNEL_KEY)
}