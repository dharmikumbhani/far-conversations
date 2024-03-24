import axios from 'axios';

export default async function getExtendedNetwork(fid:number) {
    try {
      const response = await axios.post(
        'https://graph.cast.k3l.io/scores/personalized/following/fids',
        [
          fid
        ],
        {
          params: {
            'k': '2',
            'limit': '100'
          },
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
    //   console.log(response.data.result);
      return response.data.result
    } catch (error) {
      console.error(error);
    }
}
