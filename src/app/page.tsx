import Image from "next/image";
import BookingsList from "../components/BookingsList";
import CreateBookingForm from "../components/CreateBookingForm";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <CreateBookingForm />
      <BookingsList />
    </div>
  );
}
