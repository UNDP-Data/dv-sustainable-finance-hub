import React from 'react';
import styled from 'styled-components';
import { Tag } from 'antd';
import { Programme } from '../Types';

interface CardProps {
  countryName: string;
  tags: Programme[];
}

const StyledTag = styled(Tag)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  padding: 0 0.5rem;
`;

const CardContainer = styled.div`
  flex: 1 1 calc(25% - 0.9rem);
  max-width: 250px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-300);
  &:last-of-type {
    margin-right: auto;
  }
`;

const CountryDiv = styled.div`
  border-bottom: 0.07rem solid var(--gray-300);
`;

function CardComponent(props: CardProps) {
  const { countryName, tags } = props;

  return (
    <CardContainer>
      <CountryDiv className='padding-04'>
        <h6 style={{ fontSize: '12px' }} className='undp-typography margin-00'>
          {countryName}
        </h6>
      </CountryDiv>
      {tags.length > 0 && (
        <div className='flex-div flex-wrap gap-02 padding-04'>
          {tags.map(tag => (
            <StyledTag key={tag.value} color={tag.color}>
              {tag.short}
            </StyledTag>
          ))}
        </div>
      )}
    </CardContainer>
  );
}

export default CardComponent;
