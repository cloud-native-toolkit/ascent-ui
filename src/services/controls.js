const baseUrl = '/api/controls';

export function getControls(filter) {
    let url = baseUrl;
    if (filter) {
        url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
    }
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || []);
            })
            .catch(err => reject(err));
    });
}

export function getControlDetails(id, filter) {
    let url = `${baseUrl}/${id}`;
    if (filter) {
        url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
    }
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || {});
            })
            .catch(err => reject(err));
    });
}