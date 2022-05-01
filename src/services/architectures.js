const baseUrl = '/api/architectures';

const superagent = require('superagent');

export function getArchitectures() {
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

export function getArchitectureById(archId) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/${archId}?filter=%7B%22include%22%3A%20%5B%22owners%22%5D%7D`)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || {});
            })
            .catch(err => reject(err));
    });
}

export function addArchitecture(archDetails) {
    return superagent
        .post(baseUrl)
        .send(archDetails)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function deleteArchitecture(archId) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/${archId}`, { method: 'DELETE' })
            .then(res => {
                if (res.status !== 204) reject(`${res.status} ${res.statusText}`);
                else resolve(res || {});
            })
            .catch(err => reject(err));
    });
}

export function duplicateArchitecture(archId, data) {
    return superagent
        .post(`${baseUrl}/${archId}/duplicate`)
        .send(data)
        .set('accept', 'application/json')
        .then(res => {
            console.log(res);
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function importBomYaml(data, overwrite, publicArch) {
    return superagent
        .post(`${baseUrl}/boms/import?public=${publicArch ? 'true' : 'false'}${overwrite ? '&overwrite=true' : ''}`)
        .send(data)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function uploadDiagrams(archId, data) {
    return superagent
        .post(`${baseUrl}/${archId}/diagram`)
        .send(data)
        .set('accept', 'application/json')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}

export function updateArchitecture(archId, archDetails) {
    return superagent
        .patch(`${baseUrl}/${archId}`)
        .send(archDetails)
        .set('accept', 'application/json')
        .then(res => {
            console.log(res.status);
            return res.body;
        })
        .catch(err => {
            return err.response;
        });
}
