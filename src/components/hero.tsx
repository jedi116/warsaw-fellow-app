'use client';

import { Container, Title, Button, Text, rem, Overlay } from '@mantine/core';
import backgroundImage from '../../public/photo1.jpeg'
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { css } from '@emotion/react';
import { useMediaQuery } from '@mantine/hooks';

// Hero styles using Emotion CSS
const heroStyle = css`
  position: relative;
  background-image: url(${backgroundImage.src});
  background-size: cover;
  background-position: center;
`;

const containerStyle = css`
  height: ${rem(700)};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding-bottom: calc(var(--mantine-spacing-xl) * 6);
  z-index: 1;
  position: relative;

  @media (max-width: 48em) {
    height: ${rem(500)};
    padding-bottom: calc(var(--mantine-spacing-xl) * 3);
  }
`;

const titleStyle = css`
  color: white;
  font-size: ${rem(60)};
  font-weight: 900;
  line-height: 1.1;

  @media (max-width: 48em) {
    font-size: ${rem(40)};
    line-height: 1.2;
  }

  @media (max-width: 36em) {
    font-size: ${rem(28)};
    line-height: 1.3;
  }
`;

const descriptionStyle = css`
  color: white;
  max-width: 600px;

  @media (max-width: 48em) {
    max-width: 100%;
    font-size: var(--mantine-font-size-sm);
  }
`;

const controlStyle = css`
  margin-top: calc(var(--mantine-spacing-xl) * 1.5);

  @media (max-width: 48em) {
    width: 100%;
  }
`;

export function HeroContentLeft() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)

  return (
    <div css={heroStyle}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container css={containerStyle}>
        <Title css={titleStyle}>Warsaw Ethiopian Christian Fellow Ship</Title>
        <Text css={descriptionStyle} size="xl" mt="xl">
            This is an app for registered member of the fellow ship to share and manage data 
            related to the fellow
        </Text>

        <Button 
          variant="gradient" 
          size="xl" 
          radius="xl" 
          css={controlStyle} 
          onClick={()=>{
            if (user) {
              router.push('/members')
            } else {
              router.push('/auth/login')
            }
          }}
          >
          Get started
        </Button>
      </Container>
    </div>
  );
}