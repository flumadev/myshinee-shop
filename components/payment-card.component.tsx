import { Container, HTMLChakraProps, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

interface IPaymentProps extends HTMLChakraProps<"div"> { icon: any, text: string, clicked: boolean }

function PaymentCard(props: IPaymentProps) {
    return (
        <Container {...props} width={"200px"} as={"button"} type="submit" height="80px" borderRadius={"md"} border={"1px solid"} borderColor={props.clicked ? "#058789" : "gray.200"} display={"flex"} justifyContent="center" alignItems={"center"}>
            <VStack justifyContent={"center"} alignItems="center">
                <Image src={props.icon} width="25" height={"25"} />
                <Text>{props.text}</Text>
            </VStack>
        </Container>
    )
}

export default PaymentCard