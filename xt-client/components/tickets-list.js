import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from '../styles/TicketsList.module.scss';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle,
} from 'reactstrap';

const TicketsList = ({ tickets }) => {
  const list = tickets.map((ticket) => (
    <Link href="/tickets/[ticketId]" as={ `/tickets/${ticket.id}` } key={ ticket.id }>
      <a>
        <Card className={ styles.Card }>
          <CardImg top width="100%" src="https://media.stubhubstatic.com/stubhub-catalog/d_defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_218_mul_3,$h_172_mul_3/performer/188486/1862a0d035db8349f62a7de21cea5872" alt="Card image cap" />
          <CardBody>
            <CardTitle tag="h5">{ ticket.title }</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">{ ticket.price } $</CardSubtitle>
            <CardText>{ ticket.description }</CardText>
          </CardBody>
        </Card>
      </a>
    </Link>
  ));

  return <div className={ styles.ListWrapper }>{ list }</div>
}

TicketsList.propTypes = {

}

export default TicketsList;
