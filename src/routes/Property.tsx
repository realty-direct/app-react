import { useEffect, useState } from "react";
// components/PropertyDetail.js

export interface PropertyInfo {
  id: number;
  address: string;
  price: number;
  description: string;
}

export default function Property() {
  //   const { id } = useParams();
  const [property, setProperty] = useState<PropertyInfo | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        // const response = await fetch(`/api/properties/${id}`); // Assuming an API route
        // const data = await response.json();
        const data: PropertyInfo = {
          id: 1,
          address: "123 Main St",
          price: 100000,
          description: "A lovely home in a quiet neighborhood",
        };
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    }
    fetchProperty();
  }, []);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h1>{property.address}</h1>
      <p>{property.description}</p>
      {/* Display other property details */}
    </div>
  );
}
