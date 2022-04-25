const baseUrl = '/api/control-mapping';

export function getMappings(filter) {
    return new Promise((resolve, reject) => {
        let url = baseUrl;
        if (filter) {
            url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
        }
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || []);
            })
            .catch(err => reject(err));
    });
}