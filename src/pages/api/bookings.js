import prisma from '../../app/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.bookings.findMany({
        include: {
          owner: true,
          caregiver: {
            include: {
              user: true, // Incluye la información del usuario asociado
            },
          },
          pet: true,
          service: true,
        },
      });
      



      const formattedBookings = bookings.map((booking) => ({
        id: booking.id,
        owner_name: booking.owner?.name || 'No Owner Found',
        caregiver_name: booking.caregiver?.user?.name || 'No Caregiver Found', // Accede al nombre desde `user`
        pet_name: booking.pet?.name || 'No Pet Found',
        service_name: booking.service?.name || 'No Service Found',
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        total_price: booking.total_price,
        additional_instructions: booking.additional_instructions,
      }));


      res.status(200).json(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else if (req.method === 'POST') {
    const {
      owner_id,
      caregiver_id,
      pet_id,
      service_id,
      start_time,
      end_time,
      status,
      total_price,
      additional_instructions,
    } = req.body;

    try {
      const newBooking = await prisma.bookings.create({
        data: {
          owner_id,
          caregiver_id,
          pet_id,
          service_id,
          start_time,
          end_time,
          status,
          total_price,
          additional_instructions,
        },
      });

      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Error creating booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
