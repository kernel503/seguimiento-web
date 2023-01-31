import instance from '@/plugins/axiosInstance';

async function getUser() {
  try {
    await instance.get('/user');
  } catch (error) {

  }
}

export default { getUser };
