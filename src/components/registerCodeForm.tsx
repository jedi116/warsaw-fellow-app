import {
    createStyles,
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
  } from '@mantine/core';
  import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CommonService from '@/service/UI/common';
import { useForm } from '@mantine/form';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
  
  const useStyles = createStyles((theme) => ({
    title: {
      fontSize: rem(26),
      fontWeight: 900,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  
    controls: {
      [theme.fn.smallerThan('xs')]: {
        flexDirection: 'column-reverse',
      },
    },
  
    control: {
      [theme.fn.smallerThan('xs')]: {
        width: '100%',
        textAlign: 'center',
      },
    },
  }));
  type Props = {
    confirm: Function
  }
  export function ConfirmRegistrationCodeForm({confirm}: Props) {

    const [user, loading, error] = useAuthState(auth)
    const { classes } = useStyles();
    const router = useRouter()
    const handleConfirmation = async (code: string) => {
      try {
        const codes = await CommonService.getRegistrationCodesWCilent()
        console.log(codes)
        console.log(code)
        if (codes && codes[0].value === code ) {
          confirm()
        } else {
          toast.warning('Provided code is not correct\n Please contact fellow leaders \n and get correct code')
        }
      } catch (error) {
        toast.error('Could not validate code')
      }
    }
    const _form = useForm({
      initialValues: {
        code: ''
      }
    })
    return (
      <Container size={460} my={30}>
        <Title className={classes.title} align="center">
          Confirm Registration Code
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Enter provided code to register
        </Text>
  
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <form onSubmit={_form.onSubmit(values => handleConfirmation(values.code))}>
            <TextInput label="Registration code" placeholder="code.." required {..._form.getInputProps('code')}/>
            <Group position="apart" mt="lg" className={classes.controls}>
              <Anchor color="dimmed" size="sm" className={classes.control}>
                <Center inline>
                  <IconArrowLeft size={rem(12)} stroke={1.5} />
                  <Box ml={5} onClick={() => router.push('/auth/login')}>Back to the login page</Box>
                </Center>
              </Anchor>
              <Button className={classes.control} type ='submit'>Confirm</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    );
  }