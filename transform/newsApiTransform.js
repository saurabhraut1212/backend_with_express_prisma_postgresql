import { getImageUrl } from "../utils/helper.js";

class NewsApiTransform {
    static transform(news) {
        return {
            id: news.id,
            heading: news.title,
            news: news.content,
            image: getImageUrl(news.image),
            createdAt: news.createdAt,
            reporter: {
                id: news?.user.id,
                name: news?.user.name,
                profile: news?.user?.profile !== null ? getImageUrl(news?.user?.profile) : null
            }
        }
    }
}

export default NewsApiTransform;