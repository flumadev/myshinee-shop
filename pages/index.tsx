import type { NextPage } from 'next'
import style from '../styles/Home.module.css'
import { Button, Container, Flex, form, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Input, Text, VStack } from '@chakra-ui/react'

const Home: NextPage = () => {

  // "name": "Luis Amorim",
  // "email": "luisfelipeamorim@hotmail.com",
  // "document": "18590537773",
  // "document_type": "CPF",
  // "type": "individual",
  // "phones": {
  //     "mobile_phone": {
  //         "country_code": "55",
  //         "number": "000000000",
  //         "area_code": "21"

  return (
    <Container maxW={'5xl'} margin="auto" padding={"24"}>
      <Flex justifyContent={'space-between'}>
        <Container>
          <Text fontSize={'2xl'}>Detalhes de Pagamento</Text>
          <div>
            <Text fontSize={'xl'}>Método de Pagamento</Text>
            <div>
              <div>Crédito</div>
              <div>Débito</div>
              <div>Boleto</div>
              <div>PIX</div>
            </div>
          </div>
          <form>
            <FormControl id="name" isRequired >
              <Input placeholder="Nome Completo" />
            </FormControl>
            <FormControl id="first-name" isRequired >
              <Input placeholder="CPF" />
            </FormControl>
            <FormControl id="first-name" isRequired >
              <Input placeholder="CPF" />
            </FormControl>
            <Button type='submit'>teste</Button>
          </form>
        </Container>
        <Container>
          <Container borderRadius={'sm'} bgColor="gray.100" padding={'6'} height="3xs">
            <HStack mb={"3"} justifyContent={"space-between"}>
              <Text fontWeight={"bold"} fontSize="xl">Total</Text>
              <Text fontWeight={"bold"} fontSize="xl">R$ 800,00</Text>
            </HStack>
            <hr />
            <HStack mt={"3"} justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>Item</Text>
              <Text >Kit 1</Text>
            </HStack>
            <HStack mt={"3"} justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>Desconto</Text>
              <Text color={"red.400"}>- R$ 20,00</Text>
            </HStack>
          </Container>
          <Button w={"100%"} mt="2">Pagar</Button>
        </Container>
      </Flex >
    </Container >
  )
}

export default Home
