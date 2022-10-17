import { FormEvent, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next'
import Image from 'next/image'
import { celularMask, cpfMask } from '../helpers/masks';
import { useRouter } from 'next/router';
import axios from 'axios'
import { Button, Container, Divider, Flex, FormControl, FormLabel, HStack, Input, Select, Skeleton, Text, VStack, } from '@chakra-ui/react'
import pix from '../assets/pix.svg';
import invoice from '../assets/invoice.svg';
import credit from '../assets/credit.svg';
import debit from '../assets/debit.svg';
import PaymentCard from '../components/payment-card.component';
import { states } from '../helpers/objects';
import { stringify } from 'querystring';



const Home: NextPage = () => {
  const [loading, setLoading] = useState(true)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [total, setTotal] = useState(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0))
  const [product, setProduct] = useState({} as IProduct)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [canPay, setCanPay] = useState(false)
  const [clientData, setClientData] = useState({} as IFormValues)
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const route = useRouter()

  const { id } = route.query
  const form = useRef()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const getProduct = async (productId: number | string | string[]) => {
    setLoading(true)

    const response = await axios.get(`/api/products/${productId}`)

    if (response.data[0]) {
      setProduct({
        ...response.data[0],
        max_price: formatCurrency(response.data[0].max_price)

      })
      setTotal(formatCurrency(response.data[0].max_price))
      setLoading(false)
    }

  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData(form.current)

    let formValues = {} as IFormValues

    for (const pair of formData.entries()) {
      formValues = {
        ...formValues,
        [pair[0]]: pair[1]
      }
    }
    if (formValues.complement?.length == 0) {
      delete formValues["complement"]
    }

    const emptyItems = Object.values(formValues).filter(item => item.length > 0)
    if (emptyItems.length !== 0) {
      setCanPay(true)
    }
    setClientData(formValues)
  }

  const pay = async () => {
    setLoadingPayment(true)
    if (paymentMethod === 'pix') {
      const response = await axios.post(`/api/products/pay/pix/${id}`, clientData)
      localStorage.setItem("@ms-pix", JSON.stringify(response.data))
    }

    setLoadingPayment(false)
    route.push('/pix')


  }

  useEffect(() => {
    if (id !== undefined) {
      getProduct(id)
    }
  }, [id])

  return (
    <Container maxW={'6xl'} margin="auto" padding={"24"}>
      <Text fontSize={'2xl'} fontWeight={"bold"}>Detalhes de Pagamento</Text>
      <Flex justifyContent={'space-between'} mt="12" >

        {/* @ts-ignore */}
        <Flex as={"form"} ref={form} id="clientForm" flexDirection={"column"} gap="6" onSubmit={handleSubmit}>

          <Container border={"1px solid"} borderColor="gray.200" padding="6" borderRadius={"md"} >
            <Text fontSize={'xl'} mb="6">Informação do cliente</Text>

            <Flex flexDirection="column" gap={"3"}>
              <HStack>
                <FormControl isRequired >
                  <Input id="name" name="name" placeholder="Nome Completo" />
                </FormControl>
                <FormControl id="cpf" isRequired w="250px">
                  <Input placeholder="CPF" id="cpf" name="cpf" onChange={e => setCpf(cpfMask(e.target.value))} value={cpf} />
                </FormControl>
              </HStack>
              <HStack>
                <FormControl id="email" isRequired  >
                  <Input placeholder="Email" id="email" name="email" />
                </FormControl>
                <FormControl id="phone" isRequired w="250px" >
                  <Input placeholder="Celular" id="phone" name="phone" onChange={e => setPhone(celularMask(e.target.value))} value={phone} />
                </FormControl>
              </HStack>
            </Flex>

            <Text fontSize={'xl'} my="6">Endereço</Text>


            <Flex flexDirection="column" gap={"3"}>
              <FormControl id="zip_code" isRequired  >
                <Input placeholder="CEP" id="zip_code" name="zip_code" />
              </FormControl>
              <HStack>
                <FormControl id="street" isRequired >
                  <Input placeholder="Rua" id="street" name="street" />
                </FormControl>
                <FormControl id="number" isRequired w={200}>
                  <Input placeholder="N°" id="number" name="number" />
                </FormControl>
              </HStack>
              <HStack>
                <FormControl id="district" isRequired w={"250px"} >
                  <Input placeholder="Bairro" id="district" name="district" />
                </FormControl>
                <FormControl id="complement"  >
                  <Input placeholder="Complemento" id="complement" name="complement" />
                </FormControl>
              </HStack>

              <HStack>
                <FormControl id="city" isRequired  >
                  <Input placeholder="Cidade" id="city" name="city" />
                </FormControl>
                <FormControl id="state" isRequired w={"200"}>
                  <Select placeholder='Estado' id="state" name="state" >
                    {states.map((state, i) => <option key={i} value={state.sigla}>{state.sigla}</option>)}

                  </Select>
                </FormControl>
              </HStack>
            </Flex>

          </Container>
          <Container border={"1px solid"} borderColor="gray.200" padding="6" borderRadius={"md"} >
            <Text fontSize={'xl'} mb="6">Método de pagamento</Text>
            <HStack>
              <PaymentCard clicked={paymentMethod === "debit" && canPay} icon={debit} text="Débito" onClick={() => { setPaymentMethod("debit") }} />
              <PaymentCard clicked={paymentMethod === "credit" && canPay} icon={credit} text="Crédito" onClick={() => { setPaymentMethod("credit") }} />
              <PaymentCard clicked={paymentMethod === "bankslip" && canPay} icon={invoice} text="Boleto" onClick={() => { setPaymentMethod("bankslip") }} />
              <PaymentCard clicked={paymentMethod === "pix" && canPay} icon={pix} text="Pix" onClick={() => { setPaymentMethod("pix") }} />
            </HStack>
          </Container>

        </Flex>


        <Container >
          <Container borderRadius={'md'} bgColor="gray.100" padding={'6'} >
            <HStack mb={"3"} justifyContent={"space-between"}>
              <Text fontWeight={"bold"} fontSize="xl">Total</Text>
              <Skeleton isLoaded={!loading}>
                <Text fontWeight={"bold"} fontSize="xl">{total}</Text>
              </Skeleton>
            </HStack>
            <Divider />
            <Skeleton isLoaded={!loading}>
              <HStack my={"3"} justifyContent={"space-between"}>
                <Text fontWeight={"bold"}>{product.post_title}</Text>
                <Text >{product.max_price}</Text>
              </HStack>
            </Skeleton>
            {(canPay && paymentMethod === "pix") && (
              <>
                <Divider my={"3"} borderColor={"grey.500"} />
                <Text fontWeight={"bold"}>Cliente</Text>
                <HStack justifyContent={"space-between"}>
                  <Text >Nome</Text>
                  <Text >{clientData.name.split(' ').slice(0, 2).join(' ')}</Text>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <Text >CPF</Text>
                  <Text >{clientData.cpf}</Text>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <Text >Email</Text>
                  <Text >{clientData.email}</Text>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <Text >Telefone</Text>
                  <Text >{clientData.phone}</Text>
                </HStack>
                <Text mt={"3"} fontWeight={"bold"}>Endereço de entrega</Text>
                <HStack my={"3"} justifyContent={"space-between"}>
                  <Text >{`${clientData.street}, N°${clientData.number} ${clientData.complement ? ", " + clientData.complement : ""}, ${clientData.district} - ${clientData.city}, ${clientData.state}`}</Text>
                </HStack></>
            )}
            {/* <HStack mt={"3"} justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>Desconto</Text>
              <Text color={"red.400"}>- R$ 20,00</Text>
            </HStack> */}

          </Container>
          <HStack mt={"3"} justifyContent={"space-between"}>
            {/* <FormControl>
              <FormLabel>Cupom</FormLabel>
              <HStack>
                <Input bgColor={"white"} />
                <Button border={"1px solid #058789"} color={"#058789"}>Aplicar</Button>
              </HStack>
            </FormControl> */}
          </HStack>
          <Button w={"100%"} mt="2" bgColor={"#058789"} color="white" disabled={canPay ? false : true} onClick={() => pay()} isLoading={loadingPayment}>Pagar</Button>
        </Container>
      </Flex >
    </Container >
  )
}

export default Home
