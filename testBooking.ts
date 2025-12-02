

const testBooking = async () => {
  const response = await fetch('http://localhost:7000/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MmVhNzBiNTgwMzY4NDcyYmI2ZWMyZCIsInR5cGUiOiJzdHVkZW50IiwiaWF0IjoxNzY0NjcxNDQwLCJleHAiOjE3NjQ3NTc4NDB9.zodJUaby_TUvhlshHncIWHlvKty0ihr1gsth9NHeom8'},
    body: JSON.stringify({
      propertyid: "692dfe431bc9871b26dae0dd",
      propertyType: "selfcontain",
      moveInDate: "2025-12-01",
      moveOutDate: "2026-06-01",
      duration: "1 year",
      gender: "male",
      specialRequest: "Please give me an upstairs room",
      amount: 250000,
      status: "pending",
      paymentStatus: "pending"
    })
  });

  const data = await response.json();
  console.log(data);
};

testBooking();
