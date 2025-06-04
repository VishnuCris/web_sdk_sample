
export const ExternalService = {
    async getLocationName(lat, lon) {
      try{
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
          
          const response = await fetch(url, {
              headers: {
              'User-Agent': `${window.__APP_NAME}/1.0`
              }
          });
          
          const data = await response.json();
          return data.display_name;
      }catch(error){
        return 'Unknown'
      }
    },
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      } // Example: 'e4bd3ab2-f9e6-4bc4-bf3d-2f46c5d2bb9a'
}