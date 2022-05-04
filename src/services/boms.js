const baseUrl = '/api/boms';
const archBaseUrl = '/api/architectures';
const servicesBaseUrl = '/api/services';

const superagent = require('superagent');


export function getServices() {
    return superagent
        .get(servicesBaseUrl)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || [];
        });
}

export function doPostBOM(archiId, bomDetails) {
    return superagent
        .post(`${archBaseUrl}/${archiId}/boms`)
        .send(bomDetails)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function getBOM(archiId, filter) {
    let url = `${archBaseUrl}/${archiId}/boms`;
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

export function getBomComposite(archiId) {
    return superagent
        .get(`${baseUrl}/services/${archiId}`)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || [];
        });
}

export function getBomDetails(bomId) {
    return superagent
        .get(`${baseUrl}/${bomId}/composite`)
        .set('accept', 'application/json')
        .then(res => {
            return res.body || {};
        });
}

export function doUpdateBOM(bomId, bomDetails) {
    return superagent
        .patch(`${baseUrl}/${bomId}`)
        .send(bomDetails)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function doDeleteBOM(bomId) {
    return superagent
        .delete(`${baseUrl}/${bomId}`)
        .set('accept', 'application/json')
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
}
