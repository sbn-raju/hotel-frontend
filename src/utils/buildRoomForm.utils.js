export const buildFormData = (formDataState) => {
  const formData = new FormData();

  // Top-level fields
  formData.append('room_type', formDataState.room_type);
  formData.append('room_price', formDataState.room_price);

  // Nested: room_facilities
  formData.append('room_facilities[room_bed_count]', formDataState.room_facilities.room_bed_count);
  formData.append('room_facilities[room_ac]', formDataState.room_facilities.room_ac);
  formData.append('room_facilities[room_hotWater]', formDataState.room_facilities.room_hotWater);
  formData.append('room_facilities[room_minibar]', formDataState.room_facilities.room_minibar);

  // Nested: room_food
  formData.append('room_food[breakfast]', formDataState.room_food.breakfast);
  formData.append('room_food[lunch]', formDataState.room_food.lunch);
  formData.append('room_food[dinner]', formDataState.room_food.dinner);

  // Files: room_images (array)
  formDataState.room_images.forEach((file, index) => {
    formData.append('room_images', file); // or `room_images[]` if your backend expects that
  });

  return formData;
};


