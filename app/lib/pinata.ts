import axios from 'axios';

const pinataHeaders = {
    'accept': 'application/json',
    'authorization': `Bearer ${process.env.PINATA_JWT_ACCESS_TOKEN}`,
}
export async function getUserInformation(fid:number) {
    try {
      const response = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, {
        headers: pinataHeaders
      });
    //   console.log(response);
      return response?.data?.data
    } catch (error) {
      console.error('----------ERROR---------', error);
    }
}
export async function getAllCastsOfUser(fid:number) {
    try {
      const response = await axios.get(`https://api.pinata.cloud/v3/farcaster/casts?fid=${fid}`, {
        headers: pinataHeaders
      });
    //   console.log(response?.data?.data?.casts);
      return response?.data?.data?.casts
    } catch (error) {
      console.error('----------ERROR---------', error);
    }
}

export async function getAllFollowersOfFID(fid:number) {
    try {
      const response = await axios.get(`https://api.pinata.cloud/v3/farcaster/users?fid=${fid}&followers=true`, {
        headers: pinataHeaders
      });
    //   console.log(response?.data?.data?.users);
      return response?.data?.data?.users
    } catch (error) {
      console.error('----------ERROR---------', error);
    }
}
export async function getAllFollowingOfFID(fid:number) {
    try {
      const response = await axios.get(`https://api.pinata.cloud/v3/farcaster/users?fid=${fid}&following=true`, {
        headers: pinataHeaders
      });
    //   console.log(response?.data?.data?.users);
      return response?.data?.data?.users
    } catch (error) {
      console.error('----------ERROR---------', error);
    }
}

