import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { child, get, ref } from 'firebase/database';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import checkLogin from '../../services/auth.service';
import { fbrtdb } from '../../services/firebase.service';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoExitOutline } from 'react-icons/io5';
import logOut from '../../services/logout.service';

type Sell = {
  cupom: string;
  date: string;
  discount: string;
  product: string;
  total: string;
  value: string;
  type: string;
};

function Painel() {
  const [logged, setLogged] = useState(false);
  const [cupomData, setCupomData] = useState([] as any);

  const router = useRouter();
  const query = router.query;

  function getCupomData() {
    const dbRef = ref(fbrtdb);
    get(child(dbRef, `cupons/${query.id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCupomData(Object.entries(snapshot.val().sells));
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

  function getTotal(sells: any): string {
    const initialValue = 0;
    const sumWithInitial: number = Object.values(sells).reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + currentValue.discount,
      initialValue
    ) as number;

    return formatCurrency(sumWithInitial / 100);
  }

  useEffect(() => {
    async function sessionLogin() {
      if (await checkLogin()) {
        setLogged(true);
        return;
      }
      router.push('/admin');
    }

    if (query.id === undefined) {
      router.push('/admin');
    }
    getCupomData();
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
            {query.id}
          </Text>
          <Accordion>
            {cupomData.map((item: any) => {
              return (
                <>
                  <Box padding={'6px'}>
                    <AccordionItem>
                      <AccordionButton>
                        <Box
                          display={'flex'}
                          w="100%"
                          flexDirection={'row'}
                          justifyContent="space-between"
                          textAlign="left"
                        >
                          <Text fontSize={'24px'}>{item[0]}</Text>
                          <Text fontSize={'22px'}>{getTotal(item[1])}</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <TableContainer>
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>Data</Th>
                                <Th>Método</Th>
                                <Th>Produto</Th>
                                <Th>Valor</Th>
                                <Th>Desconto</Th>
                                <Th>Valor total</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {Object.values(item[1]).map((sell: any) => {
                                return (
                                  <>
                                    <Tr>
                                      <Td>{new Date(sell.date).getDate()}</Td>
                                      <Td>{sell.type}</Td>
                                      <Td align="center">{sell.product}</Td>
                                      <Td align="center">
                                        {formatCurrency(
                                          parseInt(sell.value) / 100
                                        )}
                                      </Td>
                                      <Td align="center">
                                        {formatCurrency(
                                          parseInt(sell.discount) / 100
                                        )}
                                      </Td>
                                      <Td align="center">
                                        {formatCurrency(
                                          parseInt(sell.total) / 100
                                        )}
                                      </Td>
                                    </Tr>
                                  </>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </AccordionPanel>
                    </AccordionItem>
                  </Box>
                </>
              );
            })}
          </Accordion>
        </Box>
      </Container>
    </>
  );
}

export default Painel;
