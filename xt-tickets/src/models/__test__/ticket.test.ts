import { Ticket } from '../ticket';

describe('Ticket Model', () => {
  it('should have version control', async () => {
    // Create an instance of the ticket
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123',
    });

    // Save the ticket to the database
    await ticket.save();

    // Fetch the ticket twice to two different instances
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make different changes to both of the ticket instances
    firstInstance!.set({
      price: 10,
    });

    secondInstance!.set({
      price: 15,
    });

    // Save the first instance
    await firstInstance!.save();

    // Save the second instance and expect to error
    await expect(secondInstance!.save()).rejects.toThrow();
  });

  it('should increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123',
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
  });
});
