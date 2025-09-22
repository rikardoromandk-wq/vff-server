export const env = {
  PORT: parseInt(process.env.PORT || "10000", 10), // Render folosește variabila PORT
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "*").split(","),
  PLATFORM_FEE_PERCENT: parseFloat(process.env.PLATFORM_FEE_PERCENT || "10"),
  DEFAULT_SHIPPING_DKK: parseFloat(process.env.DEFAULT_SHIPPING_DKK || "40"),
  MIN_CONFIDENCE_HIGH: parseFloat(process.env.MIN_CONFIDENCE_HIGH || "0.65")
};
