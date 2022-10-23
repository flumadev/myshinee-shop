import { FormEvent, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next'
import Image from 'next/image'
import { cardExpireMask, cardNumberMask, celularMask, cpfMask } from '../helpers/masks';
import { useRouter } from 'next/router';
import axios from 'axios'
import { Button, Container, Divider, Flex, FormControl, FormLabel, HStack, Input, Select, Skeleton, Text, useToast, VStack, } from '@chakra-ui/react'
import pix from '../assets/pix.svg';
import invoice from '../assets/invoice.svg';
import credit from '../assets/credit.svg';
import debit from '../assets/debit.svg';
import PaymentCard from '../components/payment-card.component';
import { states } from '../helpers/objects';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}


const Home: NextPage = () => {
  const [loading, setLoading] = useState(true)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [productPrice, setProductPrice] = useState(formatCurrency(0))
  const [total, setTotal] = useState(formatCurrency(0))
  const [product, setProduct] = useState({} as IProduct)
  const [paymentMethod, setPaymentMethod] = useState("" as "credit" | "debit" | "pix" | "bankslip")
  const [canPay, setCanPay] = useState(false)
  const [clientData, setClientData] = useState({} as IFormValues)
  const [cpf, setCpf] = useState("")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardExpire: "",
    cardCVV: "",
    cardHolder: "",
    installments: 1
  })
  const [phone, setPhone] = useState("")
  const [cupomCode, setCupomCode] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const route = useRouter()
  const toast = useToast()
  const { id } = route.query
  const form = useRef()


  const getProduct = async (productId: number | string | string[]) => {
    setLoading(true)

    const response = await axios.get(`${process.env.BASE_URL}/products/${productId}`)

    if (response.data[0]) {
      setProduct({
        ...response.data[0],
        max_price: formatCurrency(response.data[0].max_price)

      })
      setProductPrice(formatCurrency(response.data[0].max_price))
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
      const response = await axios.post(`${process.env.BASE_URL}/products/pay/pix/${id}`, { ...clientData, cupomCode })

      if (response.data.status === "failed") {
        setLoadingPayment(false)
        toast({
          title: 'Erro ao gerar QRcode',
          description: "Entre em contato conosco",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        return
      }
      localStorage.setItem("@ms-pix", JSON.stringify(response.data))
      setLoadingPayment(false)
      route.push('/pix')
    }

    if (paymentMethod === 'debit') {
      try {
        const response = await axios.post(`${process.env.BASE_URL}/products/pay/card/debit/${id}`, { ...clientData, cardData, cupomCode })
        if (response.data.status === "failed") {
          toast({
            title: 'Pagamento não autorizado',
            description: "Verifique os dados e tente novamente ou entre em contato com seu banco.",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        setLoadingPayment(false)
      } catch (error) {
        toast({
          title: 'Erro ao processar pagamento',
          description: "Verifique os dados e tente novamente.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoadingPayment(false)
      }
    }

    if (paymentMethod === 'credit') {
      try {
        const response = await axios.post(`${process.env.BASE_URL}/products/pay/card/credit/${id}`, { ...clientData, cardData, cupomCode })
        if (response.data.status === "failed") {
          toast({
            title: 'Pagamento não autorizado',
            description: "Verifique os dados e tente novamente ou entre em contato com seu banco.",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        setLoadingPayment(false)
      } catch (error) {

        toast({
          title: 'Erro ao processar pagamento',
          description: "Verifique os dados e tente novamente.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoadingPayment(false)
      }
    }





  }

  const applyCupom = async () => {
    if (cupomCode === "") {
      return
    }
    setLoading(true)
    const cupomResponseData = await axios.get(`${process.env.BASE_URL}/cupons/${cupomCode}`)
    const cupomData: ICupom = cupomResponseData.data[0]
    if (cupomData === undefined) {
      toast({
        title: 'Cupom inválido',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)

      return
    }

    if (cupomData.discount_type === "percent") {
      const value = parseFloat(productPrice.replaceAll("R$", ""))
      const discount = ((parseFloat(cupomData.coupon_amount) / 100) * value)
      const valueWithDiscount = value - discount;
      setTotal(formatCurrency(valueWithDiscount))
      setDiscountValue(formatCurrency(discount))
      setLoading(false)
    }

  }

  useEffect(() => {
    if (id !== undefined) {
      getProduct(id)
    }
  }, [id])

  return (
    <Container maxW={'7xl'} margin="24px auto" padding={{ sm: "12", lg: "24" }}>
      <Text fontSize={'2xl'} fontWeight={"bold"}>Detalhes de Pagamento</Text>
      <Flex justifyContent={'space-between'} mt="12" gap={"20px"} flexDir={{ base: "column", lg: "row" }}>

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
            <Flex gap={"12px"} alignItems="center" justifyContent={"center"} direction={{ base: "column", sm: "row" }}>
              <HStack gap={"6px"}>
                <PaymentCard clicked={paymentMethod === "debit"} icon={debit} text="Débito" onClick={() => { setPaymentMethod("debit") }} />
                <PaymentCard clicked={paymentMethod === "credit" && canPay} icon={credit} text="Crédito" onClick={() => { setPaymentMethod("credit") }} />
              </HStack>
              <HStack gap={"6px"}>
                <PaymentCard clicked={paymentMethod === "bankslip" && canPay} icon={invoice} text="Boleto" onClick={() => { setPaymentMethod("bankslip") }} />
                <PaymentCard clicked={paymentMethod === "pix" && canPay} icon={pix} text="Pix" onClick={() => { setPaymentMethod("pix") }} />
              </HStack>
            </Flex>
          </Container>

        </Flex>


        <Container padding={"0"} >
          <Container padding={"0"} >
            {(canPay && (paymentMethod !== "pix")) && (
              <Container border={"1px solid"} borderColor="gray.200" padding="6" borderRadius={"md"} mb="6">
                <Text fontSize={'xl'} mb="6">{paymentMethod === "debit" ? "Débito" : "Crédito"}</Text>
                <Flex flexDirection="column" gap={"3"}>
                  <VStack>
                    <FormControl isRequired >
                      <Input id="number" name="number" placeholder="Número do cartão" onChange={(e) => setCardData({ ...cardData, cardNumber: cardNumberMask(e.target.value) })} value={cardData.cardNumber} />
                    </FormControl>

                    <FormControl isRequired >

                      <Input placeholder="Nome impresso no cartão" textTransform={"uppercase"} id="holder_name" name="holder_name" onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })} />
                    </FormControl>
                  </VStack>
                  <HStack>
                    <FormControl isRequired  >
                      <Input placeholder="Validade" id="expire" name="expire" value={cardData.cardExpire} onChange={(e) => setCardData({ ...cardData, cardExpire: cardExpireMask(e.target.value) })} />
                    </FormControl>
                    <FormControl isRequired w="250px" >
                      <Input placeholder="CVV" id="cvv" name="cvv" maxLength={3} onChange={(e) => setCardData({ ...cardData, cardCVV: e.target.value })} />
                    </FormControl>
                  </HStack>
                  {paymentMethod === "credit" && (
                    <>
                      <FormControl isRequired >
                        <Select placeholder="Parcelas" id="installments" name="installments" onChange={(e) => setCardData({ ...cardData, installments: parseInt(e.target.value) })} >
                          {new Array(10).fill(1).map((item, i) => {
                            return <option key={i} value={i + 1}>{i + 1}x {formatCurrency(parseFloat(total.replace("R$", "")) / (i + 1))}</option>
                          })}
                        </Select>
                      </FormControl></>
                  )}
                </Flex>
              </Container>
            )}

          </Container>
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
              {discountValue && (
                <HStack mt={"3"} justifyContent={"space-between"}>
                  <Text fontWeight={"bold"}>Desconto</Text>
                  <Text color={"red.400"}>- {discountValue}</Text>
                </HStack>
              )}
            </Skeleton>
            {(canPay && paymentMethod === "pix") && (
              <Container padding={0} fontSize={{ base: "14px", sm: "16px" }}>
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
                </HStack>
              </Container>
            )}
          </Container>
          <HStack mt={"3"} justifyContent={"space-between"}>
            <FormControl>
              <FormLabel>Cupom</FormLabel>
              <HStack>
                <Input bgColor={"white"} value={cupomCode} disabled={discountValue !== ""} onChange={(e) => {
                  setCupomCode(e.target.value)
                }} />
                {discountValue !== "" ? (
                  <Button colorScheme={"red"} onClick={() => {
                    setCupomCode("")
                    setDiscountValue("")
                    setTotal(productPrice)
                  }}>Remover</Button>

                ) :
                  <Button isLoading={loading} border={"1px solid #058789"} color={"#058789"} onClick={() => {
                    applyCupom()
                  }}>Aplicar</Button>
                }

              </HStack>
            </FormControl>
          </HStack>
          <Button w={"100%"} mt="2" bgColor={"#058789"} color="white" disabled={canPay ? false : true} onClick={() => pay()} isLoading={loadingPayment}>Pagar</Button>
        </Container>
      </Flex >
    </Container >
  )
}

export default Home
