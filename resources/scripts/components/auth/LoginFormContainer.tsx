import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
}

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <>
        <div css={tw`bg-gradient-to-r from-purplebluedark to-purplebluelight pb-60`}>
        {title &&
        <h2 css={tw`text-3xl text-center text-neutral-100 font-medium pt-12 pb-4`}>
            {title}
        </h2>
        }
        </div>
        <div css={tw`-mt-60`}>
        <Container>
        <FlashMessageRender css={tw`mb-2 px-1`}/>
        <Form {...props} ref={ref}>
            <div css={tw`md:flex w-full bg-neutral-800 shadow-lg rounded-lg p-6 mx-1`}>
                <div css={tw`flex-1`}>
                    {props.children}
                </div>
            </div>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-4`}>
            &copy; 2015 - 2020&nbsp;
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
            >
                Pterodactyl Software
            </a>
        </p>
        </Container>
        </div>
    </>
));
