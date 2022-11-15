import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ref, get, child } from 'firebase/database';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoExitOutline } from 'react-icons/io5';
import checkLogin from '../../services/auth.service';
import { fbrtdb } from '../../services/firebase.service';
import logOut from '../../services/logout.service';

function Painel() {
  const [logged, setLogged] = useState(false);
  const [cupons, setCupons] = useState([] as any);
  const router = useRouter();
  const toast = useToast();

  function getCupomData() {
    const dbRef = ref(fbrtdb);
    get(child(dbRef, `cupons/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCupons(Object.entries(snapshot.val()));
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  function getSells(sells: any): { qty: number; value: number } {
    const newObj = Object.values(sells).map((item: any) => {
      return Object.values(item);
    });

    const initialValue = 0;
    const sumWithInitial = newObj[0].reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + currentValue.discount,
      initialValue
    );

    return {
      qty: newObj.flat(Infinity).length,
      value: sumWithInitial as number,
    };
  }

  useEffect(() => {
    async function sessionLogin() {
      if (await checkLogin()) {
        setLogged(true);
        getCupomData();
        return;
      }
      router.push('/admin');
    }
    sessionLogin();
  }, []);

  if (logged === false) {
    return <></>;
  }

  return (
    <>
      <Container paddingY={'24px'} maxW="900px">
        <Flex justifyContent={'space-between'}>
          <Button
            variant={`ghost`}
            onClick={() => {
              router.back();
            }}
          >
            <Icon as={AiOutlineArrowLeft} />
          </Button>
          <Button
            variant={`ghost`}
            onClick={() => {
              logOut();
            }}
          >
            <Icon as={IoExitOutline} fontSize={'24px'} />
          </Button>
        </Flex>
        <Text fontSize={'32px'} fontWeight="bold">
          Painel Admin
        </Text>
        <Box mt={'32px'}>
          <Text fontSize={'24px'} fontWeight="bold">
            Cupons
          </Text>
          <Flex gap={'16px'} mt="16px">
            {cupons.map((cupom: any, i: number) => {
              return (
                <>
                  <Box
                    key={i}
                    width={'300px'}
                    padding={'24px'}
                    borderRadius={'16px'}
                    bgColor={'#058789'}
                    color="white"
                    onClick={() => {
                      router.push(`/admin/${cupom[0]}`);
                    }}
                  >
                    <Text
                      fontWeight={'bold'}
                      w={'min-content'}
                      _hover={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(cupom[0]);
                        if (!toast.isActive(cupom[0])) {
                          toast({
                            id: cupom[0],
                            title: 'Cupom copiado.',
                            description:
                              'O código do cupom foi copiado com sucesso',
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      {cupom[0]}
                    </Text>
                    <Text>{getSells(cupom[1].sells).qty}</Text>
                    <Text>
                      {formatCurrency(getSells(cupom[1].sells).value / 100)}
                    </Text>
                  </Box>
                </>
              );
            })}
          </Flex>
        </Box>
      </Container>
    </>
  );
}

export default Painel;
