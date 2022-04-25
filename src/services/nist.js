const baseUrl = '/api/nist';

export function getNist() {
    return new Promise((resolve, reject) => {
        fetch(baseUrl)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || []);
            })
            .catch(err => reject(err));
    });
}

export function getNistDetails(id) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/${id}`)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || {});
            })
            .catch(err => reject(err));
    });
}
