class ArdConverter {
    matches(url) {
        return /^https?:\/\/(www\.)?ardmediathek\.de\/.+$/.test(url)
    }

    pluginUrl(url) {
        return fetch(url)
            .then(response => response.text())
            .then(text => text.match("contentId\":(\\d+)"))
            .then(match => {
                if (match) {
                    const contentId = match[1];
                    return `plugin://plugin.video.ardmediathek_de/?mode=libArdPlay&documentId=${contentId}`
                } else {
                    throw new Error("Could not find contentId");
                }
            })
    }
}

class MeansTvConverter {
    matches(url) {
        return /^https?:\/\/(www\.)?means\.tv\/.+$/.test(url)
    }

    async pluginUrl(url) {
        // This part is currently not working, haven't tried much either
        const finalUrl = url.split("?")[0]
        return `plugin://plugin.video.meanstv/?show=video&id=${finalUrl}`;
    }
}

class YoutubeConverter {
    regExp = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)(\w+)$/;

    matches(url) {
        return this.regExp.test(url)
    }

    async pluginUrl(url) {
        const matches = url.match(this.regExp);
        if (matches.length > 3) {
            const id = matches[3]
            return `plugin://plugin.video.youtube/play/?video_id=${id}`;
        } else {
            throw new Error("Could not find video id");
        }
    }
}


converters = [
    new ArdConverter(),
    new MeansTvConverter(),
    new YoutubeConverter(),
]