import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Icon,
  Img,
  Text,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import signInWithGoogle from '../../services/login.service';
import { useRouter } from 'next/router';
import checkLogin from '../../services/auth.service';

function Admin() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login() {
    setLoading(true);
    setError(false);

    const data = await signInWithGoogle();
    if (data !== null) {
      setLoading(false);

      router.push('/admin/painel');
      return;
    }
    setLoading(false);
    setError(true);
  }

  useEffect(() => {
    async function sessionLogin() {
      if (await checkLogin()) {
        router.push('/admin/painel');
      }
    }
    sessionLogin();
  }, []);

  return (
    <Grid justifyContent={'center'} alignItems={'center'} height={'100vh'}>
      <Box
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        gap={'16px'}
      >
        <Img
          filter={'invert(1)'}
          src="https://myshinee.com.br/wp-content/themes/yootheme/cache/17/Logo-MyShinee-2-e1664409515802-17eb2d58.webp"
        />
        <Button
          isLoading={loading}
          onClick={() => login()}
          gap={'16px'}
          variant={'outline'}
        >
          Login com google <Icon as={FcGoogle} />
        </Button>
        {error && (
          <Text textAlign={'center'} fontSize="14px" color={'red'}>
            Usuário não autorizado
          </Text>
        )}
      </Box>
    </Grid>
  );
}

export default Admin;
