const baseUrl = '/api/control-mapping';

export function getMappings(filter, notify) {
    return new Promise((resolve, reject) => {
        let url = baseUrl;
        if (filter) {
            url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
        }
        fetch(url)
            .then(res => res.json())
            .then(res => resolve(res || []))
            .catch(err => notify('error', 'Error', 'Error fetching mapping data.'));
    });
}