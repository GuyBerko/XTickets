import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const TicketsList = ({ tickets }) => {

  return (
    <div>
      <h1>Tickets</h1>

      <div className="list-group">
        { tickets.map(ticket => (
          <Link href="/tickets/[ticketId]" as={ `/tickets/${ticket.id}` } key={ ticket.id }>
            <a className="list-group-item list-group-item-action" aria-current="true">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ ticket.title }</h5>
                <small>{ ticket.price } $</small>
              </div>
              <p className="mb-1">Some placeholder content in a paragraph.</p>
              <small>And some small print.</small>
            </a>
          </Link>
        )) }
      </div>
    </div>
  )
}

TicketsList.propTypes = {

}

export default TicketsList;
