const baseUrl = '/api/services';

export function getServiceDetails(serviceId) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/${serviceId}?filter=%7B%22include%22%3A%20%5B%22controls%22%5D%7D`)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res);
            })
            .catch(err => reject(err));
    });
}

export function getServiceCatalog(serviceId) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/catalog/${serviceId}`)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res);
            })
            .catch(err => reject(err));
    });
}
