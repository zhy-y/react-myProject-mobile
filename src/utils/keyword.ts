const KEYWORDS_KEY = 'keywords'

export const setKeywords = (keywords: string[]) => {
    localStorage.setItem(KEYWORDS_KEY, JSON.stringify(keywords))
}
export const getKeywords = (): string[] => {
    return JSON.parse(localStorage.getItem(KEYWORDS_KEY) || '[]')
}
export const removeKeywords = () => {
    localStorage.removeItem(KEYWORDS_KEY)
}