const baseUrl = '/api/automation';

export function getAutomation(automationId) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/${automationId}/details`)
            .then(res => res.json())
            .then(res => {
                if (res.error) reject(res.error);
                else resolve(res || {});
            })
            .catch(err => reject(err));
    });
}
