import styled from 'styled-components';
import StyledPage from './contained-page';

const StyledBadge = styled.div``;
const StyledCard = styled.div``;
const StyledText = styled.p``;

export const SCard = ({ className = "", style = {}, sectioned, children }) => (
    <StyledCard style={style} className={`Polaris-Card ${className || ''}`}>
        {sectioned &&
            <StyledCard className="Polaris-Card__Section">
                {children}
            </StyledCard>
        }
        {
            !sectioned && children
        }
    </StyledCard>
);

export const SDisplayText = ({ className = "", style = {}, size, children }) => (
    <StyledText style={style} className={`Polaris-DisplayText ${size ? ('Polaris-DisplayText--size' + size.charAt(0).toUpperCase() + size.slice(1)) : ''} ${className || ''}`}>
        {children}
    </StyledText>
);

export const SBadge = ({ className = "", style = {}, children }) => (
    <StyledBadge style={style} className={`Polaris-Badge ${className || ''}`}>
        {children}
    </StyledBadge>
);

export const STextStyle = ({ className = "", style = {}, variation, children }) => (
    <StyledText style={style} className={`Polaris-TextStyle ${variation ? ('Polaris-TextStyle--variation' + variation.charAt(0).toUpperCase() + variation.slice(1)) : ''} ${className || ''}`}>
        {children}
    </StyledText>
);

export const PaddedCard = styled(SCard)`
    padding: 1rem;
`;

export const BaseCard = styled(PaddedCard)`
    min-height: 10rem;
    display: flex;
`;

export const ContainedPage = styled(StyledPage)`
`;