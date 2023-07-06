import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { logInWithEmailAndPassword } from '@/service/UI/firebaseUiClient';
  
  export default function Login() {
    const router = useRouter()
    const _form = useForm({
      initialValues: {email:'',password:''},
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
      }
    }) 
    const handleLogin = async (values: {
      email: string;
      password: string;
  }) => {
      const success = await logInWithEmailAndPassword(values.email, values.password)
      success && router.push('/')
    }
    

    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component="button" onClick={()=>router.push('/auth/register')}>
            Create account
          </Anchor>
        </Text>
        
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={_form.onSubmit(values => handleLogin(values))}>
          <TextInput 
            label="Email" 
            placeholder="Email" 
            required 
            {..._form.getInputProps('email')}
            />
          <PasswordInput 
            label="Password" 
             placeholder="Your password" 
             required 
             mt="md"
             {..._form.getInputProps('password')} 
            />
            <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type='submit'>
            Sign in
          </Button>
        </form>
        </Paper>
      </Container>
    );
  }