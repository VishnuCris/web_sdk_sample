
export const ExternalService = {
    async getLocationName(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        
        const response = await fetch(url, {
            headers: {
            'User-Agent': 'YourAppName/1.0'
            }
        });
        
        const data = await response.json();
        return data.display_name;
    }
}