import nearestPharmacies from '../data/nearestPharmacies.json';
import pharmacies from '../data/pharmacies.json';

interface RawPharmacy {
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
}

export function generateStores() {
  const raw = [...(pharmacies as RawPharmacy[]), ...(nearestPharmacies as RawPharmacy[])];

  return raw.map((pharmacy) => ({
    name: pharmacy.name,
    address: `${pharmacy.address}, ${pharmacy.city}`,
    phone: pharmacy.phone,
    isOpen: true,
    rating: pharmacy.rating,
  }));
}
