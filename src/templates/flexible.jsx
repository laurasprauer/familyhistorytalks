import React from 'react';
import Container from '@components/container';

class FlexibleTemplate extends React.Component {
  render() {
    const { slug, type, data } = this.props.pageContext;
    return <Container slug={slug} type={type} data={data} />;
  }
}

export default FlexibleTemplate;
