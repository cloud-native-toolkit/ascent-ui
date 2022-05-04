const baseUrl = '/api/control-mapping';

const superagent = require('superagent');


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

export function getServiceMappings(serviceId){
    return superagent
        .get(`${baseUrl}/service/${serviceId}`)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || [];
        });
}

export function getArchMappings(archId) {
    return superagent
        .get(`${baseUrl}/architecture/${archId}`)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || [];
        });
}

export function addMapping(mappingDetails) {
    return superagent
        .post(baseUrl)
        .send(mappingDetails)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function updateMapping(mappingId, mappingDetails) {
    return superagent
        .patch(`${baseUrl}/${mappingId}`)
        .send(mappingDetails)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function deleteMapping(mapping) {
    return superagent
        .delete(baseUrl)
        .send(mapping)
        .set('accept', 'application/json')
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
}

export function getProfiles(filter) {
    let url = "/api/mapping/profiles";
    if (filter) {
        url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
    }
    return superagent
        .get(url)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || [];
        });
}

export function addProfile(file) {
    let url = "/api/mapping/profiles/import";
    return superagent
        .post(url)
        .send(file)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}
