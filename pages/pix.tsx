import { Container, HStack, Skeleton, Text, useToast, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import api from '../services/api.service'

interface IPayment {
    amount: number
    charges: Array<ICharges>
}
interface ICharges {
    last_transaction: ILastTransaction
    id: string

}

interface ILastTransaction {
    "qr_code": string,
    "qr_code_url": string,
    "expires_at": string | Date,

}

function Index() {
    const [paymentData, setPaymentData] = useState({} as IPayment)
    const route = useRouter()
    const toast = useToast()
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    const treatExpireTime = () => {
        const hour = new Date(paymentData.charges[0].last_transaction.expires_at).getHours()
        let minutes = (new Date(paymentData.charges[0].last_transaction.expires_at).getMinutes()).toString()
        if (parseInt(minutes) < 10) {
            minutes = "0" + minutes
        }
        return `${hour}:${minutes}`
    }

    useEffect(() => {
        const localData = localStorage.getItem("@ms-pix")

        if (localData === null) {
            route.push("https://myshinee.com.br/")
            return
        }


        setPaymentData(JSON.parse(localData))
    }, [])

    return (
        <Container w="100%" maxW={'7xl'} py={"20"} textAlign="center">
            <Text fontWeight={"bold"} fontSize={"2xl"} textAlign="center">Código Pix gerado!</Text>
            <Text textAlign="center">Falta pouco pra completar o seu pedido! Use os dados abaixo para pagar:</Text>
            <Container mt={"20px"} border="1px solid black" borderRadius={"md"} borderColor="gray.300" p={"24px"} px={0} w="100%">
                <HStack>
                    <Container>
                        <VStack>
                            <Text fontWeight={"bold"} fontSize={"xl"}>Valor</Text>
                        </VStack>
                        <VStack>
                            <Text>{formatCurrency(paymentData.amount / 100)}</Text>
                        </VStack>
                    </Container>
                    <Container>
                        <VStack>
                            <Text fontWeight={"bold"} fontSize={"xl"}>Vencimento</Text>
                        </VStack>
                        <VStack>
                            <Text>{paymentData.charges && treatExpireTime()}</Text>
                        </VStack>
                    </Container>
                </HStack>
                <Text fontWeight={"bold"} mt="20px">Pague com Pix</Text>
                <Text mb="20px">Use o app de seu banco ou carteira digital para escanear o código QR abaixo:</Text>
                <Skeleton width="240px" height={"240px"} margin="0 auto" isLoaded={paymentData.charges !== undefined}>
                    <Image src={paymentData.charges && paymentData.charges[0].last_transaction.qr_code_url} width="240px" height={"240px"} />
                </Skeleton>
                <Text mt={"20px"} fontWeight="bold" color={"blue.300"} _hover={{ cursor: 'pointer' }} onClick={() => {
                    navigator.clipboard.writeText(paymentData.charges[0].last_transaction.qr_code)
                    toast({
                        title: 'Código Copiado',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                }}>Copiar Chave Pix</Text>
            </Container>
        </Container >
    )
}

export default Index