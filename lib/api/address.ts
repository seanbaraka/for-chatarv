export const getAddress = async (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(`/api/neighborhood?address=${encodedAddress}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
};
