import { DisplayText, Heading } from '@shopify/polaris';
import React from 'react';
import styled from 'styled-components';

const SectionTitle = ({ children }) => {
    return (
        <TitleContainer>
            <Heading element="h1">{children}</Heading>
            {/* <TitleLine /> */}
        </TitleContainer>
    );
}

const TitleContainer = styled.div`
    padding-bottom: 1rem;
`;

const TitleLine = styled.hr`
    margin-left: 0;
    width: 7.25rem;
    height: 2px;
    border: none;
    color: #000;
    background-color: #000;
`;

export default SectionTitle;